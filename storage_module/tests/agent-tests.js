'use strict'

const test = require('ava')

let db = null

test.beforeEach(async () => {
  const setupDatabase = require('../')
  db = await setupDatabase()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})
