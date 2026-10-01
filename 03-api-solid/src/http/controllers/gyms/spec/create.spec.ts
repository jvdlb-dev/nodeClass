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

  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    expect(response.statusCode).toEqual(201)
  })
})
