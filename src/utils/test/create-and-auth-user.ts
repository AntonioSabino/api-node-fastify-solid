import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(
  app: FastifyInstance,
  email = 'authenticateduser@example.com',
) {
  await request(app.server).post('/users').send({
    name: 'Authenticated User',
    email,
    password: '123456',
  })

  const response = await request(app.server).post('/auth').send({
    email,
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
