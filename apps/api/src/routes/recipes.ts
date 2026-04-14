import { FastifyInstance } from 'fastify'
import prisma from '../prisma'

interface RecipeBody {
  name: string
  prepMinutes: number
  difficulty?: string
  recipeUrl?: string
  tags: string[]
  costEstimate?: number
  ingredients: {
    name: string
    category: string
    quantity: number
    unit: string
  }[]
}

export default async function recipeRoutes(server: FastifyInstance) {

  // GET /api/recipes — listar todas (con filtro opcional por tag)
  server.get<{ Querystring: { tag?: string; search?: string } }>(
    '/',
    async (req) => {
      const { tag, search } = req.query

      return prisma.recipe.findMany({
        where: {
          ...(tag ? { tags: { has: tag } } : {}),
          ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
        },
        include: {
          ingredients: {
            include: { ingredient: true }
          }
        },
        orderBy: { name: 'asc' }
      })
    }
  )

  // GET /api/recipes/:id
  server.get<{ Params: { id: string } }>(
    '/:id',
    async (req, reply) => {
      const recipe = await prisma.recipe.findUnique({
        where: { id: req.params.id },
        include: {
          ingredients: { include: { ingredient: true } }
        }
      })
      if (!recipe) return reply.status(404).send({ error: 'Receta no encontrada' })
      return recipe
    }
  )

  // POST /api/recipes — crear receta con ingredientes
  server.post<{ Body: RecipeBody }>(
    '/',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const { name, prepMinutes, difficulty, recipeUrl, tags, costEstimate, ingredients } = req.body

      const recipe = await prisma.$transaction(async (tx) => {
        // Upsert ingredientes (crear si no existen)
        const ingredientRecords = await Promise.all(
          ingredients.map(ing =>
            prisma.ingredient.upsert({
              where: { name: ing.name },
              update: {},
              create: { name: ing.name, category: ing.category, unit: ing.unit }
            })
          )
        )

        return prisma.recipe.create({
          data: {
            name, prepMinutes, difficulty, recipeUrl, tags,
            costEstimate,
            ingredients: {
              create: ingredientRecords.map((ing, i) => ({
                ingredientId: ing.id,
                quantity: ingredients[i].quantity,
                unit: ingredients[i].unit
              }))
            }
          },
          include: { ingredients: { include: { ingredient: true } } }
        })
      })

      return reply.status(201).send(recipe)
    }
  )

  // POST /api/recipes/:id/feedback — puntuar una receta
  server.post<{
    Params: { id: string }
    Body: { memberId: string; rating: number }
  }>(
    '/:id/feedback',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const feedback = await prisma.recipeFeedback.create({
        data: {
          recipeId: req.params.id,
          memberId: req.body.memberId,
          rating: req.body.rating
        }
      })
      return reply.status(201).send(feedback)
    }
  )
}