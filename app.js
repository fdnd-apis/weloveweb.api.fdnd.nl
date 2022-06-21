require('dotenv').config()
const express = require('express')

const indexRoute = require('./routes/index')
const sessionRoute = require('./routes/session')
const errorRoute = require('./routes/error')

module.exports = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

  .use('/', indexRoute)
  .use('/v1/session', sessionRoute)
  .use(errorRoute)
