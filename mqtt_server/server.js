'use strict'

require('dotenv').config()

// const debug = require('debug')('mqtt_server:mqtt')
const chalk = require('chalk')
const aedes = require('aedes')
const redisMqEmitter = require('mqemitter-redis')
const redisPersistence = require('aedes-persistence-redis')
// const storage = require('')
const port = 1883

const aedesPersistenceRedis = redisPersistence({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  family: 4
})

const mq = redisMqEmitter({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_URL,
  family: 4
})

const broker = aedes.Server({
  persistence: aedesPersistenceRedis, mq
})

const server = require('net').createServer(broker.handle)

broker.on('client', (client) => {
  console.log(`Client Connected ${client.id}`)
})

broker.on('clientDisconnect', (client) => {
  console.log(`Client Disconnected ${client.id}`)
})

broker.on('publish', (packet, _client) => {
  console.log('Received', packet.topic)
  console.log('Payload', packet.payload)
})

broker.on('connectionError', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[mqtt_server-mqtt]')} server is running`)
})
