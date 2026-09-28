import type {
  FindManyNearbyParams,
  GymsRepository,
} from '@/repositories/gyms-repository'
import type { GymCreateInput } from '../../../generated/prisma/models'
import { prisma } from '@/lib/prisma'
import type { Gym } from '../../../generated/prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

  async create(data: GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE (
        6371 * acos(
          cos(radians(${params.latitude})) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians(${params.longitude})) +
          sin(radians(${params.latitude})) *
          sin(radians(latitude))
        )
      ) <= 10
    `

    return gyms
  }
}
