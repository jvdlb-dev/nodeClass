import { randomUUID } from 'node:crypto'
import { expect, describe, it, afterAll, beforeAll, beforeEach } from 'vitest'
import { app } from '@/app'
import supertest from 'supertest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/use-cases/utils/test/create-and-authenticate-user'

const request = supertest

describe('Search Gyms', () => {
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

  it('should be able to get create gym', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const searchTerm = `JavaScript Search ${randomUUID()}`
    const javascriptGymTitle = `JavaScript Search ${searchTerm}`
    const typescriptGymTitle = `TypeScript Search ${randomUUID()}`

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: typescriptGymTitle,
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: javascriptGymTitle,
        description: 'Some description',
        phone: '123456789',
        latitude: -23.5489,
        longitude: -46.6388,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript Search',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: javascriptGymTitle,
      }),
    ])
    expect(response.body.gyms).toHaveLength(1)
    expect(response.statusCode).toEqual(200)
  })
})
