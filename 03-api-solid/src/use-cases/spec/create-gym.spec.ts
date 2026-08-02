import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from '../create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -23.55052,
      longitude: -46.633308,
    })

    expect(gym.id).toEqual(expect.any(String))
    expect(gym.title).toBe('JavaScript Gym')
  })
})
