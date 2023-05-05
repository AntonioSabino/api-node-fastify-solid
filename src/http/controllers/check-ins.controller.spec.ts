import { app } from '@/app'
import { createAndAuthUser } from '@/utils/test/create-and-auth-user'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

describe('CheckInsController', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthUser(
      app,
      'authenticateduser@example.com',
      true,
    )

    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TypeScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const response = await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    expect(response.statusCode).toBe(201)
  })

  it('should be able to list history of check-ins', async () => {
    const { token } = await createAndAuthUser(app, 'history@email.com', true)

    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JavaScript Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    vi.setSystemTime(new Date('2023-03-28T10:00:00.000Z'))
    await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.checkIns).toHaveLength(2)
  })

  it('should be able to get the total count of check-ins', async () => {
    const { token } = await createAndAuthUser(app, 'count@email.com', true)

    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Fastify Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    vi.setSystemTime(new Date('2023-03-28T10:00:00.000Z'))
    await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    const response = await request(app.server)
      .get('/check-ins/count')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.count).toBe(2)
  })

  it('should be able validate the check-in', async () => {
    const { token } = await createAndAuthUser(app, 'validate@email.com', true)

    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Node Gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const checkIn = await request(app.server)
      .post(`/check-ins/${gym.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.body.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toBe(204)

    const checkInAfterValidation = await request(app.server)
      .get(`/check-ins/${checkIn.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(checkInAfterValidation.body.validatedAt).not.toBeNull()
  })
})
