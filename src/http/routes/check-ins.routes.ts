import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../middlewares/verify-jwt'
import makeCheckInsController from './factories/check-ins.factory'
import { verifyRole } from '../middlewares/verify-role'

const checkInsController = makeCheckInsController()

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/count', (req, res) => checkInsController.count(req, res))
  app.get('/history', (req, res) => checkInsController.findMany(req, res))

  app.patch(
    '/:checkInId/validate',
    { onRequest: [verifyRole('ADMIN')] },
    (req, res) => checkInsController.validate(req, res),
  )
  app.post('/:gymId', (req, res) => checkInsController.create(req, res))
}
