import { FastifyInstance } from 'fastify'
import { userRoutes } from './users.routes'
import { authenticationRoutes } from './authenticate.routes'
import { gymsRoutes } from './gyms.routes'
import { checkInsRoutes } from './check-ins.routes'

export async function appRoutes(app: FastifyInstance) {
  app.register(authenticationRoutes, { prefix: '/auth' })
  app.register(userRoutes, { prefix: '/users' })
  app.register(checkInsRoutes, { prefix: '/check-ins' })
  app.register(gymsRoutes, { prefix: '/gyms' })
}
