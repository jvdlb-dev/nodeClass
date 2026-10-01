import z from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const source = request.method === 'GET' ? request.query : request.body

  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(source)
  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  if (request.method === 'GET') {
    const getUserProfile = makeGetUserProfileUseCase()
    const { sub } = request.user as { sub: string }
    const { user } = await getUserProfile.execute({ userId: sub })

    return reply.status(201).send({
      user: {
        ...user,
        password_hash: undefined,
      },
    })
  }

  return reply.status(201).send()
}
