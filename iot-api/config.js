'use strict'

const debug = require('debug')('iot_api:db')

require('dotenv').config()

module.exports = {
  db: {
    database: process.env.PG_DB_DATABASE,
    username: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASSWORD,
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT,
    dialect: 'postgres',
    logging: s => debug(s)
  },
  auth: {
    secret: process.env.SECRET,
    algorithms: ['HS256']
  }
}
