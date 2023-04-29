import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import CheckInsService from './check-ins.service'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckIn } from '@/common/interfaces/check-ins.interface'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'

describe('CheckIn Service', () => {
  let gymsRepository: InMemoryGymsRepository
  let checkInsRepository: InMemoryCheckInsRepository
  let checkInsService: CheckInsService

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInsService(checkInsRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym_id',
      name: 'Gym Name',
      description: 'Gym Description',
      phone: 'Gym Phone',
      latitude: '0',
      longitude: '0',
    })

    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to create a new check-in', async () => {
    const checkIn = await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
      userLatitude: '0',
      userLongitude: '0',
    })

    expect(checkIn).toHaveProperty('id')
    expect(checkIn).toHaveProperty('createdAt')
    expect(checkIn).toHaveProperty('user_id', 'user_id')
    expect(checkIn).toHaveProperty('gym_id', 'gym_id')
  })

  it('should not be able to create a new check-in twice in the same day', async () => {
    vi.setSystemTime(new Date('2023-03-28T10:00:00.000Z'))

    await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
      userLatitude: '0',
      userLongitude: '0',
    })

    vi.setSystemTime(new Date('2023-03-28T22:00:00.000Z'))

    await expect(
      checkInsService.create({
        gymId: 'gym_id',
        userId: 'user_id',
        userLatitude: '0',
        userLongitude: '0',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to create a new check-in twice in diffent days ', async () => {
    vi.setSystemTime(new Date('2023-03-28T10:00:00.000Z'))

    await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
      userLatitude: '0',
      userLongitude: '0',
    })

    vi.setSystemTime(new Date('2023-03-29T10:00:00.000Z'))

    const secondCheckIn = await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
      userLatitude: '0',
      userLongitude: '0',
    })

    expect(secondCheckIn).toMatchObject<CheckIn>
  })
})
