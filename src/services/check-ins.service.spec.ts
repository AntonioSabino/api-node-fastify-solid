import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import CheckInsService from './check-ins.service'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckIn } from '@/common/interfaces/check-ins.interface'

describe('CheckIn Service', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let checkInsService: CheckInsService

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInsService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should be able to create a new check-in', async () => {
    const checkIn = await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
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
    })

    vi.setSystemTime(new Date('2023-03-28T22:00:00.000Z'))

    await expect(
      checkInsService.create({
        gymId: 'gym_id',
        userId: 'user_id',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to create a new check-in twice in diffent days ', async () => {
    vi.setSystemTime(new Date('2023-03-28T10:00:00.000Z'))

    await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
    })

    vi.setSystemTime(new Date('2023-03-29T10:00:00.000Z'))

    const secondCheckIn = await checkInsService.create({
      gymId: 'gym_id',
      userId: 'user_id',
    })

    expect(secondCheckIn).toMatchObject<CheckIn>
  })
})
