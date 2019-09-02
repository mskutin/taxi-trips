const throwError = require('http-errors')
const Metric = require('../models/metric')

exports.list = async (req, res) => {
  try {
    const [{ updated_at, count }] = await Metric.find({})
    res.send({
      updated_at: updated_at,
      dropoff: {
        count: count || 0
      }
    })
  } catch (error) {
    console.error(error)
  }
}
