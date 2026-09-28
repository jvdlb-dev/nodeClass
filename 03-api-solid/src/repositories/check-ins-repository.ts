import type { CheckIn, Prisma } from '../../generated/prisma/client'

export interface CheckInsRepository {
  findById: (id: string) => Promise<CheckIn | null>
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>
  create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>
  save: (checkIn: CheckIn) => Promise<CheckIn>
  countByUserId: (userId: string) => Promise<number>
}
