import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Register Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const email = `john.doe-${randomUUID()}@example.com`

    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email,
      password: 'password123',
    })
    expect(response.statusCode).toEqual(201)
  })
})
