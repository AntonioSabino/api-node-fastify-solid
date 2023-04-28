import { FastifyInstance } from 'fastify'
import makeUsersController from './controllers/factories/users.factory'
import makeAuthController from './controllers/factories/authenticate.factory'

const userController = makeUsersController()
const authController = makeAuthController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (req, res) => userController.createUser(req, res))
  app.post('/users/login', (req, res) => authController.login(req, res))
}
