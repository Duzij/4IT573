import knex from 'knex'
import knexfile from '../knexfile.js'

const db = knex(knexfile[process.env.NODE_ENV || "development"])

export const getAllTodos = async () => {
  const todos = await db('todos').select('*')

  return todos
}

export default db;