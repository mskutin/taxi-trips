require('dotenv').config()

const config = {
  general: {
    exitTimeout: process.env.READ_TIMEOUT
  }
 }

 module.exports = config
