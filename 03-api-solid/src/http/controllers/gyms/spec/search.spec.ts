import { expect, describe, it, afterAll, beforeAll } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'

const request = supertest

describe('Search Gyms', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get create gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .get('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    await request(app.server)
      .get('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TypeScript Gym',
      }),
    ])
    expect(response.body.gyms).toHaveLength(1)
    expect(response.statusCode).toEqual(200)
  })
})
