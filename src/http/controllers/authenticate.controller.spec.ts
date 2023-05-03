import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('AuthenticateController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/user').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(app.server).post('/auth').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })

  it('should not be able to authenticate with invalid credentials', async () => {
    const response = await request(app.server).post('/auth').send({
      email: 'wrong.email@example.com',
      password: 'wrong-password',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      message: 'Invalid credentials',
    })
  })
})
