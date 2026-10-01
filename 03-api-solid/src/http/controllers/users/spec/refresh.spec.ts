import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { randomUUID } from 'node:crypto'

const request = supertest

describe('Refresh Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh the token', async () => {
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

    const cookies = authResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('Missing Set-Cookie header')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      }),
    )
    expect(response.get('Set-Cookie')).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=')]),
    )
  })
})
