
const express = require('express')
const app = express()
const router = express.Router()
const db = require('./config/db')
const metrics = require('./routes/metrics')
const morganLogger = require('morgan')
const winston = require('./config/winston')
const port = process.env.APP_PORT || 8080

app.use(morganLogger('combined', {stream: winston.stream}))
app.use(express.json())

app.use('/metrics', metrics)

app.listen(port, function () {
  console.log('Web Server has been started')
  console.log(metrics.stack)
})

module.exports = app
