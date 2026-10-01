import { randomUUID } from 'node:crypto'
import { expect, describe, it, afterAll, beforeAll, beforeEach } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'

const request = supertest

describe('Nearby Gyms', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.checkIn.deleteMany()
    await prisma.gym.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const nearbyGymTitle = `Nearby TypeScript Gym ${randomUUID()}`
    const farAwayGymTitle = `Far Away JavaScript Gym ${randomUUID()}`

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: nearbyGymTitle,
        description: 'Some description',
        phone: '123456789',
        latitude: -22.970722,
        longitude: -43.182365,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: farAwayGymTitle,
        description: 'Some description',
        phone: '123456789',
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.970722,
        longitude: -43.182365,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: nearbyGymTitle,
      }),
    ])
    expect(response.body.gyms).toHaveLength(1)
    expect(response.statusCode).toEqual(200)
  })
})
