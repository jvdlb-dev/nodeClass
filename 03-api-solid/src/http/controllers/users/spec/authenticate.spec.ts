import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Authenticate Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const email = `john.doe-${randomUUID()}@example.com`

    await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    const response = await request(app.server).post('/sessions').send({
      email,
      password: 'password123',
    })
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
  })
})
