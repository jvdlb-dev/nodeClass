import type { CheckIn } from '../../generated/prisma/client'
import type { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckinUseCaseRequest {
  userId: string
  gymId: string
}

type CheckinUseCaseResponse = {
  checkIn: CheckIn
}

export class CheckinUseCase {
  // eslint-disable-next-line no-useless-constructor
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
