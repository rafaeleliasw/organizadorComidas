import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'

import familyRoutes from './routes/families'
import memberRoutes from './routes/members'
import recipeRoutes from './routes/recipes'
import planRoutes from './routes/plans'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<void>
  }
}

dotenv.config()

const server = Fastify({ logger: true })

// Plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true
})

server.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-prod'
})

// Decorator para proteger rutas
server.decorate('authenticate', async (request: any, reply: any) => {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ error: 'No autorizado' })
  }
})

// Rutas
server.register(familyRoutes, { prefix: '/api/families' })
server.register(memberRoutes, { prefix: '/api/members' })
server.register(recipeRoutes, { prefix: '/api/recipes' })
server.register(planRoutes,   { prefix: '/api/plans' })

// Health check
server.get('/health', async () => ({ status: 'ok' }))

// Arrancar
const start = async () => {
  try {
    await server.listen({ port: 4000, host: '0.0.0.0' })
    console.log('Servidor corriendo en http://localhost:4000')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()