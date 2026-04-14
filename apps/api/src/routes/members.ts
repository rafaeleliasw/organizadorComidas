import { FastifyInstance } from 'fastify'
import prisma from '../prisma'

interface MemberBody {
  familyId: string
  name: string
  avatarUrl?: string
  preferences?: { foodTag: string; score: number }[]
  restrictions?: { type: string }[]
}

export default async function memberRoutes(server: FastifyInstance) {

  // POST /api/members — crear miembro
  server.post<{ Body: MemberBody }>(
    '/',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const { familyId, name, avatarUrl, preferences = [], restrictions = [] } = req.body

      const member = await prisma.member.create({
        data: {
          familyId,
          name,
          avatarUrl,
          preferences: {
            create: preferences.map(p => ({
              foodTag: p.foodTag,
              score: p.score
            }))
          },
          restrictions: {
            create: restrictions.map(r => ({ type: r.type }))
          }
        },
        include: { preferences: true, restrictions: true }
      })

      return reply.status(201).send(member)
    }
  )

  // PUT /api/members/:id — editar miembro completo
  server.put<{ Params: { id: string }; Body: MemberBody }>(
    '/:id',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      const { name, avatarUrl, preferences = [], restrictions = [] } = req.body
      const memberId = req.params.id

      // Reemplazar preferencias y restricciones en una transacción
      const member = await prisma.$transaction(async (tx) => {
        await prisma.memberPreference.deleteMany({ where: { memberId } })
        await prisma.dietaryRestriction.deleteMany({ where: { memberId } })

        return prisma.member.update({
          where: { id: memberId },
          data: {
            name,
            avatarUrl,
            preferences: {
              create: preferences.map(p => ({
                foodTag: p.foodTag,
                score: p.score
              }))
            },
            restrictions: {
              create: restrictions.map(r => ({ type: r.type }))
            }
          },
          include: { preferences: true, restrictions: true }
        })
      })

      return member
    }
  )

  // DELETE /api/members/:id
  server.delete<{ Params: { id: string } }>(
    '/:id',
    { onRequest: [server.authenticate] },
    async (req, reply) => {
      await prisma.member.delete({ where: { id: req.params.id } })
      return reply.status(204).send()
    }
  )
}