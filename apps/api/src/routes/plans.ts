import { FastifyInstance } from 'fastify'
import { generateWeeklyMenu, generateShoppingList } from '../services/menuEngine'
import prisma from '../prisma'

interface GenerateBody {
  familyId: string
  weekStart: string // ISO date: "2025-04-14"
  days: {
    date: string     // "2025-04-14"
    memberIds: string[]
  }[]
}

export default async function planRoutes(server: FastifyInstance) {

  // GET /api/plans?familyId=xxx — planes de una familia
  server.get<{ Querystring: { familyId: string } }>(
    '/',
    { onRequest: [server.authenticate] },
    async (req) => {
      return prisma.weeklyPlan.findMany({
        where: { familyId: req.query.familyId },
        include: {
          days: {
            include: {
              recipe: { include: { ingredients: { include: { ingredient: true } } } },
              members: { include: { member: true } }
            }
          }
        },
        orderBy: { weekStart: 'desc' }
      })
    }
  )

  // POST /api/plans/generate — generar menú semanal
  server.post<{ Body: GenerateBody }>(
    '/generate',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const { familyId, weekStart, days } = req.body

      req.log.info('Generate plan request: ' + JSON.stringify({ familyId, weekStart, days }))

      // Correr el algoritmo
      const menuDays = await generateWeeklyMenu(
        familyId,
        days.map(d => ({
          date: new Date(d.date),
          memberIds: d.memberIds
        }))
      )

      req.log.info('Generated menuDays: ' + JSON.stringify(menuDays))

      // Guardar el plan en BD dentro de una transacción
      const plan = await prisma.$transaction(async (tx) => {
        const newPlan = await prisma.weeklyPlan.create({
          data: {
            familyId,
            weekStart: new Date(weekStart),
            status: 'draft'
          }
        })

        for (const day of menuDays) {
          const planDay = await prisma.planDay.create({
            data: {
              planId: newPlan.id,
              dayDate: day.dayDate,
              recipeId: day.recipeId,
              members: {
                create: day.memberIds.map(memberId => ({ memberId }))
              }
            }
          })
        }

        return newPlan
      })

      // Generar lista de compras automáticamente
      const shoppingList = await generateShoppingList(plan.id)

      return reply.status(201).send({ plan, shoppingList })
    }
  )

  // PUT /api/plans/:id/confirm — confirmar borrador
  server.put<{ Params: { id: string } }>(
    '/:id/confirm',
    { onRequest: [server.authenticate] },
    async (req) => {
      return prisma.weeklyPlan.update({
        where: { id: req.params.id },
        data: { status: 'confirmed' }
      })
    }
  )

  // PATCH /api/plans/:planId/days/:dayId/recipe — cambiar receta de un día
  server.patch<{
    Params: { planId: string; dayId: string }
    Body: { recipeId: string }
  }>(
    '/:planId/days/:dayId/recipe',
    { onRequest: [server.authenticate] },
    async (req) => {
      return prisma.planDay.update({
        where: { id: req.params.dayId },
        data: { recipeId: req.body.recipeId }
      })
    }
  )

  // GET /api/plans/:id/shopping — lista de compras de un plan
  server.get<{ Params: { id: string } }>(
    '/:id/shopping',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const items = await prisma.shoppingListItem.findMany({
        where: { planId: req.params.id },
        include: { ingredient: true }
      })
      if (!items.length) return reply.status(404).send({ error: 'Sin items' })

      // Agrupar por categoría
      const grouped = items.reduce((acc, item) => {
        const cat = item.ingredient.category
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(item)
        return acc
      }, {} as Record<string, typeof items>)

      return grouped
    }
  )

  // PATCH /api/plans/:planId/shopping/:itemId — marcar "ya tengo en casa"
  server.patch<{
    Params: { planId: string; itemId: string }
    Body: { haveAtHome: boolean }
  }>(
    '/:planId/shopping/:itemId',
    { onRequest: [server.authenticate] },
    async (req) => {
      return prisma.shoppingListItem.update({
        where: { id: req.params.itemId },
        data: { haveAtHome: req.body.haveAtHome }
      })
    }
  )
}