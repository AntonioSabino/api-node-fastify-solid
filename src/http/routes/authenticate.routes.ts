import { FastifyInstance } from 'fastify'
import makeAuthController from './factories/authenticate.factory'

const authenticationController = makeAuthController()

export async function authenticationRoutes(app: FastifyInstance) {
  app.post('/', (req, res) => authenticationController.login(req, res))
}
