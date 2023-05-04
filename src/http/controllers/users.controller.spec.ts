import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'

describe('UsersController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'User 1',
      email: 'user1@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to list a user', async () => {
    const { token } = await createAndAuthUser(app)

    const userResponse = await request(app.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.body).haveOwnProperty('user')
    expect(userResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'authenticateduser@example.com',
      }),
    )
  })
})
