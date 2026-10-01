import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
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

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email,
      }),
    )
  })
})
