const express = require('express')
const router = express.Router()
const metrics = require('../controllers/metrics')

router.get('/', function (req, res) {
  metrics.list(req, res)
})

module.exports = router
