import { FastifyInstance } from 'fastify'
import makeUsersController from './controllers/factories/users.factory'
import makeAuthController from './controllers/factories/authenticate.factory'
import { verifyJwt } from './middlewares/verify-jwt'

const userController = makeUsersController()
const authController = makeAuthController()

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', (req, res) => userController.createUser(req, res))
  app.get('/users/me', { onRequest: [verifyJwt] }, (req, res) =>
    userController.getUser(req, res),
  )
  app.post('/auth', (req, res) => authController.login(req, res))
}
