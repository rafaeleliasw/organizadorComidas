import { FastifyInstance } from 'fastify'
import prisma from '../prisma'

export default async function familyRoutes(server: FastifyInstance) {

  // GET /api/families — listar familias del usuario autenticado
  server.get('/', { onRequest: [server.authenticate] }, async (req) => {
    const user = req.user as { id: string }

    return prisma.family.findMany({
      where: { ownerId: user.id },
      include: {
        members: {
          include: {
            preferences: true,
            restrictions: true
          }
        }
      }
    })
  })

  // GET /api/families/:id
  server.get<{ Params: { id: string } }>(
    '/:id',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const family = await prisma.family.findUnique({
        where: { id: req.params.id },
        include: {
          members: {
            include: { preferences: true, restrictions: true }
          }
        }
      })
      if (!family) return reply.status(404).send({ error: 'Familia no encontrada' })
      return family
    }
  )

  // POST /api/families — crear familia
  server.post<{ Body: { name: string } }>(
    '/',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const user = req.user as { id: string }

      const family = await prisma.family.create({
        data: {
          name: req.body.name,
          ownerId: user.id
        }
      })
      return reply.status(201).send(family)
    }
  )

  // PUT /api/families/:id
  server.put<{ Params: { id: string }; Body: { name: string } }>(
    '/:id',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const user = req.user as { id: string }
      const family = await prisma.family.findUnique({ where: { id: req.params.id } })

      if (!family) return reply.status(404).send({ error: 'No encontrada' })
      if (family.ownerId !== user.id) return reply.status(403).send({ error: 'Sin permiso' })

      return prisma.family.update({
        where: { id: req.params.id },
        data: { name: req.body.name }
      })
    }
  )

  // DELETE /api/families/:id
  server.delete<{ Params: { id: string } }>(
    '/:id',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const user = req.user as { id: string }
      const family = await prisma.family.findUnique({ where: { id: req.params.id } })

      if (!family) return reply.status(404).send({ error: 'No encontrada' })
      if (family.ownerId !== user.id) return reply.status(403).send({ error: 'Sin permiso' })

      await prisma.family.delete({ where: { id: req.params.id } })
      return reply.status(204).send()
    }
  )
}