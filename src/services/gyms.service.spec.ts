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

  it('should be able to find gyms by name', async () => {
    await gymsService.create({
      name: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: '-23.6697338',
      longitude: '-46.4594521',
    })

    await gymsService.create({
      name: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: '-23.6697338',
      longitude: '-46.4594521',
    })

    const gyms = await gymsService.findManyByName('TypeScript Gym', 1)

    expect(gyms).toHaveLength(1)
  })

  it('should be able to find paginated gyms by name', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsService.create({
        name: `TypeScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: '-23.6697338',
        longitude: '-46.4594521',
      })
    }

    const gyms = await gymsService.findManyByName('TypeScript Gym', 2)

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'TypeScript Gym 20' }),
      expect.objectContaining({ name: 'TypeScript Gym 21' }),
    ])
  })

  it('should be able to find nearby gyms', async () => {
    // This gym should be returned
    await gymsService.create({
      name: 'Near Gym',
      description: null,
      phone: null,
      latitude: '-23.6697338', // less than 10 km away
      longitude: '-46.4594521', // less than 10 km away
    })

    // This gym should not be returned
    await gymsService.create({
      name: 'Far Gym',
      description: null,
      phone: null,
      latitude: '-23.5143729862382',
      longitude: '-46.77836580488991',
    })

    const gyms = await gymsService.findNearbyGyms(-23.6697338, -46.4594521)

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ name: 'Near Gym' })])
  })
})
