import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)
  const fetchUserCheckInsUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsUseCase.execute({
    userId: (request.user as { sub: string }).sub,
    page,
  })

  return reply.status(201).send(checkIns)
}
