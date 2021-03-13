'use strict'

require('dotenv').config()

const { parsePayload } = require('./utils')
const debug = require('debug')('mqtt_server:mqtt')
const chalk = require('chalk')
const aedes = require('aedes')
const redisMqEmitter = require('mqemitter-redis')
const redisPersistence = require('aedes-persistence-redis')
const storageDb = require('storage_module')
const port = 1883

const clients = new Map()

let Agent, Metric

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

const config = {
  database: process.env.PG_DB_DATABASE,
  username: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  host: process.env.PG_DB_HOST,
  port: process.env.PG_DB_PORT,
  dialect: 'postgres',
  logging: msg => debug(msg)
}

const broker = aedes.Server({
  persistence: aedesPersistenceRedis, mq
})

const server = require('net').createServer(broker.handle)

broker.on('client', (client) => {
  debug(`Client Connected ${client.id}`)
  clients.set(client.id, null)
})

broker.on('clientDisconnect', async (client) => {
  debug(`Client Disconnected ${client.id}`)
  const agent = clients.get(clients.id)

  if (agent) {
    agent.connected = false

    try {
      await Agent.createOrUpdate(agent)
    } catch (err) {
      return handleError(err)
    }

    clients.delete(client.id)
    server.publish({
      topic: 'agent/disconnected',
      payload: JSON.stringify({
        agent: {
          uuid: agent.uuid
        }
      })
    })
    debug(`Client (${client.id}) associated to Agent (${agent.uuid}) marked as disconnected`)
  }
})

broker.on('publish', async (packet, client) => {
  debug('Received', packet.topic)
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug('Payload', packet.payload)
      break
    case 'agent/message':
      // eslint-disable-next-line no-case-declarations
      const payload = parsePayload(packet.payload)
      if (payload) {
        payload.agent.connected = true

        let agent
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (err) {
          return handleError(err)
        }
        debug(`Agent ${agent.uuid} saved`)
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          broker.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }

        for (const metric of payload.metrics) {
          let m
          try {
            m = await Metric.create(agent.uuid, metric)
          } catch (err) {
            return handleError(err)
          }
          debug(`Metric ${m.id} saved on agent ${agent.uuid}`)
        }
      }
      break
  }
})

broker.on('connectionError', handleFatalError)

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, async () => {
  const services = await storageDb(config)
    .catch(handleFatalError)

  Agent = services.Agent
  Metric = services.Metric

  console.log(`${chalk.green('[mqtt_server-mqtt]')} server is running`)
})
