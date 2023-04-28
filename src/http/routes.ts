import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate.controller'
import makeUsersController from './factories/users.factory'

const controller = makeUsersController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (req, res) => controller.createUser(req, res))
  app.post('/sessions', authenticate)
}
