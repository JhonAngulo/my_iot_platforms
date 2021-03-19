'use strict'

const debug = require('debug')('web-app:server')
const chalk = require('chalk')
const path = require('path')
const Agent = require('agent')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const agent = new Agent()

const proxy = require('./proxy')
const { pipe } = require('./utils')

const port = 8080

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

// Socket

io.on('connection', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

// Express error Handle

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ 'error': err.message })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ 'error': err.message })
  }

  res.status(500).send({ 'error': err.message })
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[web-app]')} Server listening on the http://localhost:${port}`)
  agent.connect()
})
