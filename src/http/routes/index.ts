import { FastifyInstance } from 'fastify'
import { userRoutes } from './users.routes'
import { authenticationRoutes } from './authenticate.routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/user' })
  app.register(authenticationRoutes, { prefix: '/auth' })
}