import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Authenticated User',
    email: 'authenticateduser@example.com',
    password: '123456',
  })

  const response = await request(app.server).post('/auth').send({
    email: 'authenticateduser@example.com',
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
