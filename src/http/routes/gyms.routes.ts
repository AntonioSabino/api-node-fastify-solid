import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import makeGymsController from './factories/gyms.factory'
import { verifyRole } from '../middlewares/verify-role'

const gymsController = makeGymsController()

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/', { onRequest: [verifyRole('ADMIN')] }, gymsController.createGym)
  app.get('/search', (req, res) => gymsController.findGymsByName(req, res))
  app.get('/nearby', (req, res) => gymsController.findNearbyGyms(req, res))
}
