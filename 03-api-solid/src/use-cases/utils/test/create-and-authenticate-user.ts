import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `john.doe-${randomUUID()}@example.com`

  await request(app.server).post('/users').send({
    name: 'John Doe',
    email,
    password: 'password123',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password: 'password123',
  })

  const { token } = authResponse.body

  return {
    token,
    email,
  }
}
