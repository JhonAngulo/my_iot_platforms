'use strict'

const debug = require('debug')('web-app:server')
const chalk = require('chalk')
const path = require('path')

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = 8080

app.use(express.static(path.join(__dirname, 'public')))

// Socket

io.on('connection', socket => {
  debug(`Connected ${socket.id}`)

  socket.on('agent/message', payload => {
    console.log(payload)
  })

  setInterval(() => {
    socket.emit('agent/message', { 'agent': 'xxx-yyy' })
  }, 2000)
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[web-app]')} Server listening on port ${port}`)
})
