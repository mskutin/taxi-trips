require('dotenv').config()

const config = {
  general: {
    exitTimeout: process.env.READ_TIMEOUT || 1000
  },
  pubsub: {
    maxInProgress: process.env.MAX_IN_PROGRESS || 25,
  }
 }

 module.exports = config
