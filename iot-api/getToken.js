'use strict'

require('dotenv').config()

const auth = require('./auth')

const payload = {
  username: 'test',
  admin: true,
  permissions: [
    'metrics:read'
  ]
}

auth.sign(payload, process.env.SECRET, console.log)
