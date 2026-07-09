import type { FastifyInstance } from 'fastify'
import { knex } from '../database.js'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions')
      .where('amount', 1000)
      .select('*')

    return transactions
  })
}
