'use strict'

require('dotenv').config()

const debug = require('debug')('storage_module:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {
  if (process.argv.pop() !== '--yes') {
    const answer = await prompt({
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database. are you sure?'
    })
    if (!answer.setup) {
      return console.log('Nothing happened')
    }
  }

  const config = {
    database: process.env.PG_DB_DATABASE,
    username: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASSWORD,
    host: process.env.PG_DB_HOST,
    port: process.env.PG_DB_PORT,
    dialect: 'postgres',
    logging: msg => debug(msg),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log(`${chalk.green('[DB Success!]')}`)
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
