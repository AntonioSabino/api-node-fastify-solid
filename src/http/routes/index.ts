import { FastifyInstance } from 'fastify'
import { userRoutes } from './users.routes'
import { authenticationRoutes } from './authenticate.routes'
import { gymsRoutes } from './gyms.routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes, { prefix: '/users' })
  app.register(authenticationRoutes, { prefix: '/auth' })
  app.register(gymsRoutes, { prefix: '/gyms' })
}
