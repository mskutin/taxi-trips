const mongoose = require('mongoose')

/**
 * RIDE SAMPLE
 {
  "ride_id": "76ac50af-95c9-4965-9a20-44e9504e2b50",
  "point_idx": 314,
  "latitude": 40.73821,
  "longitude": -73.98165,
  "timestamp": "2019-08-24T04:33:36.01269-04:00",
  "meter_reading": 14.400946,
  "meter_increment": 0.045862883,
  "ride_status": "enroute",
  "passenger_count": 1
 }
*/

const tripSchema = new mongoose.Schema({
  ride_id: String,
  point_idx: Number,
  latitude: Number,
  longitude: Number,
  timestamp: Date,
  meter_reading: Number,
  meter_increment: Number,
  ride_status: String,
  passenger_count: Number
}, { timestamps: true })

tripSchema.index({createdAt: 1}, {expireAfterSeconds: 7200})

module.exports = mongoose.model('Trip', tripSchema)
