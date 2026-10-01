import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()
  const { sub } = request.user as { sub: string }

  const { user } = await getUserProfile.execute({
    userId: sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
