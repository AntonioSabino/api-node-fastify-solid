import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import makeUsersController from './factories/users.factory'

const userController = makeUsersController()

export async function userRoutes(app: FastifyInstance) {
  app.post('/', (req, res) => userController.createUser(req, res))
  app.get('/me', { onRequest: [verifyJwt] }, (req, res) =>
    userController.getUser(req, res),
  )
}
