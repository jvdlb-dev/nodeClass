import fastify from 'fastify'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

export const app = fastify()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
})
