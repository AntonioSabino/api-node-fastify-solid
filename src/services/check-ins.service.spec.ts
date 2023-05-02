import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import CheckInsService from './check-ins.service'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckIn } from '@/common/interfaces/check-ins.interface'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { MaxNumberOfCheckInsError } from '@/common/errors/max-number-of-check-ins-erro'
import { MaxDistanceError } from '@/common/errors/max-distance-error'
import { ResourceNotFoundError } from '@/common/errors/resource-not-found-error'

describe('CheckIn Service', () => {
  let gymsRepository: InMemoryGymsRepository
  let checkInsRepository: InMemoryCheckInsRepository
  let checkInsService: CheckInsService

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInsService(checkInsRepository, gymsRepository)

    gymsRepository.create({
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
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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

  it('should not be able to check-in on distant gym', async () => {
    const createdGym = await gymsRepository.create({
      name: 'Gym Name',
      description: 'Gym Description',
      phone: 'Gym Phone',
      latitude: '-23.6697338',
      longitude: '-46.4594521',
    })

    await expect(() =>
      checkInsService.create({
        gymId: createdGym.id,
        userId: 'user_id',
        userLatitude: '-23.678979',
        userLongitude: '-46.428101',
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to get check-in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInsRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const checkIns = await checkInsService.findManyByUserId('user_01', 1)

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_01' }),
      expect.objectContaining({ gym_id: 'gym_02' }),
    ])
  })

  it('should be able to get paginated check-in history', async () => {
    for (let i = 0; i < 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym_${i}`,
        user_id: 'user_01',
      })
    }

    const checkIns = await checkInsService.findManyByUserId('user_01', 2)

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym_20' }),
      expect.objectContaining({ gym_id: 'gym_21' }),
    ])
  })

  it('should be able to count check-ins by user', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    await checkInsRepository.create({
      gym_id: 'gym_02',
      user_id: 'user_01',
    })

    const count = await checkInsService.countByUserId('user_01')

    expect(count).toBe(2)
  })

  it('should be able to validate the checked-in', async () => {
    await checkInsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user_01',
    })

    const validatedCheckIn = await checkInsService.validateCheckIn('user_01')

    expect(validatedCheckIn.createdAt).toEqual(expect.any(Date))
  })

  it('should not be able to validate the checked-in if not exists', async () => {
    await expect(
      checkInsService.validateCheckIn('inexistent_user'),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
