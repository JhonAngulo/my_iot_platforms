'use strict'

const express = require('express')
const axios = require('axios').default

const { endpoint, apiToken } = require('./config')

const api = express.Router()

const instance = axios.create({
  'baseURL': endpoint,
  'timeout': 1000,
  'headers': { 'Authorization': `Bearer ${apiToken}` },
  'responseType': 'json'
})

api.get('/agents', async (_req, res, next) => {
  let result
  try {
    result = await instance.get('/api/agents')
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result.data)
})

api.get('/agents/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  let result
  try {
    result = await instance.get(`/api/agents/${uuid}`)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result.data)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  let result
  try {
    result = await instance.get(`/api/metrics/${uuid}`)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result.data)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params

  let result
  try {
    result = await instance.get(`/api/metrics/${uuid}/${type}`)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result.data)
})

module.exports = api
