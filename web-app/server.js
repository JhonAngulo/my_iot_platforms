'use strict'
// eslint-disable-next-line no-unused-vars
const debug = require('debug')('web-app:server')
const chalk = require('chalk')

const port = 8080

const express = require('express')
const app = express()

app.listen(port, () => {
  console.log(`${chalk.green('[web-app]')} Server listening on port ${port}`)
})
