const mongoose = require('mongoose')

/**
 * METRIC SAMPLE
 {
  count: 23,
  updated_at: Date
 }
*/

const metricSchema = new mongoose.Schema({
  count: Number,
  updated_at: Date
})

module.exports = mongoose.model('Metric', metricSchema)
