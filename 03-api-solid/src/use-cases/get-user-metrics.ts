import type { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

type GetUserMetricsUseCaseResponse = {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  // eslint-disable-next-line no-useless-constructor
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
