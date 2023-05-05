import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthUser(
  app: FastifyInstance,
  email = 'authenticateduser@example.com',
  isAdmin = false,
) {
  await request(app.server)
    .post('/users')
    .send({
      name: 'Authenticated User',
      email,
      role: isAdmin ? 'ADMIN' : 'USER',
      password: '123456',
    })

  const response = await request(app.server).post('/auth').send({
    email,
    password: '123456',
  })

  const { token } = response.body

  return { token }
}
