const mongoose = require('mongoose')
const MetricModel = require('./models/metric')
const TripModel = require('./models/trip')
const db = require('./config/db')
const config = require('./config/config')

const { general: { exitTimeout } } = config


const calculateMetrics = async () => {
  const hourAgo = new Date(new Date().getTime() - (1000 * 60 * 60)).toISOString()
  const now = new Date().toISOString()
  const dropoff = {
    $match: {
      ride_status: "dropoff",
      timestamp: { "$gte": hourAgo, "$lte": now },
    }
  }
  const counter = {
    $group: { _id: null, count: { "$sum": 1 } }
  }

  const data = await TripModel.aggregate([dropoff, counter])
  return data[0] || 0
}


const updateMetrics = async (document) => {
  const _doc = {
    updated_at: new Date().toISOString(),
    count: document.count
  }
  const options = {upsert: true, new: true, setDefaultsOnInsert: true, returnNewDocument: true}
  const updated = await MetricModel.collection.findOneAndReplace({}, _doc, options)
  return updated.value
}

const proccessor = async () => {
  try {
    setInterval(async () => {
      const metrics = await calculateMetrics()
      const res = await updateMetrics(metrics)
      console.log('Updated:', JSON.stringify(res))
    }, 10000)

    setTimeout(() => {
      console.log(`exiting...`)
      process.exit(1)
    }, exitTimeout * 1000);

  } catch (error) {
    console.error(error)
  }
}

proccessor()
