import type { FastifyInstance } from 'fastify'

import { verifyJwt } from '../../middlewares/verify-jwt'

import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms', create)
  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)

  app.post('/gyms', create)
}
