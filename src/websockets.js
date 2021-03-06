import ejs from 'ejs'
import { WebSocketServer, WebSocket } from 'ws'
import db from './db.js'

/** @type {Set<WebSocket>} */
const connections = new Set()

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    connections.add(ws)

    console.log('New connection', connections.size)

    ws.on('close', () => {
      connections.delete(ws)

      console.log('Closed connection', connections.size)
    })
  })
}

export const sendTodosToAllConnections = async () => {
  const todos = await db('todos').select('*')

  const html = await ejs.renderFile('views/_todos.ejs', {
    todos,
  })

  for (const connection of connections) {
    const message = {
      type: 'todos',
      html,
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}

export const sendTodoDetailToAllConnections = async (id) => {

  const todo = await db('todos').select('*').where('id', id).first()

  const html = await ejs.renderFile('views/_todo_detail.ejs', {
    todo
  })

  for (const connection of connections) {
    const message = {
      type: "todo_detail",
      title: todo.text,
      id,
      html,
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}

export const sendTodoDeletedToAllConnections = async (id) => {

  for (const connection of connections) {
    const message = {
      type: 'todo_deleted',
      id
    }

    const json = JSON.stringify(message)

    connection.send(json)
  }
}
