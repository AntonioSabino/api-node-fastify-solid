import { beforeEach, describe, expect, it } from 'vitest'
import { GymsRepository } from '@/repositories/gyms.repository'
import { GymsService } from './gyms.service'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

describe('Gyms Service', () => {
  let gymsRepository: GymsRepository
  let gymsService: GymsService

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    gymsService = new GymsService(gymsRepository)
  })

  it('should be able to create gyms', async () => {
    const gym = await gymsService.create({
      name: 'Gym Name',
      description: null,
      phone: null,
      latitude: '-23.6697338',
      longitude: '-46.4594521',
    })

    expect(gym).toHaveProperty('id')
  })
})
