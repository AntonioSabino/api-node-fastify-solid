import { FastifyInstance } from 'fastify'
import makeAuthController from './factories/authenticate.factory'

const authenticationController = makeAuthController()

export async function authenticationRoutes(app: FastifyInstance) {
  app.post('/', (req, res) => authenticationController.login(req, res))

  app.patch('/refresh', (req, res) =>
    authenticationController.refreshToken(req, res),
  )
}
