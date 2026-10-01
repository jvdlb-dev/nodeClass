import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'

const request = supertest

describe('Create Gym', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get create gym', async () => {
    const { token, email } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    expect(profileResponse.statusCode).toEqual(201)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email,
      }),
    )
  })
})
