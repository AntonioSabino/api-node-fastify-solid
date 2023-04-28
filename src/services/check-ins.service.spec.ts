import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins.repository'
import CheckInsService from './check-ins.service'
import { beforeEach, describe, expect, it } from 'vitest'

describe('CheckIn Service', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let checkInsService: CheckInsService

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInsService = new CheckInsService(checkInsRepository)
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
})
