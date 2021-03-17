'use strict'

const debug = require('debug')('iot_api:server')
const chalk = require('chalk')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use('/api', require('./api'))

// Express error Handle

app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError)
  process.on('unhandledRejection', handleFatalError)

  app.listen(port, () => {
    console.log(`${chalk.green('[iot-api]')} Example app listening at http://localhost:${port}`)
  })
}

module.exports = app
