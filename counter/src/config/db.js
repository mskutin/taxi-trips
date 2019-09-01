require('dotenv').config()
const mongoose = require('mongoose')

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  MONGO_REPLICASET
} = process.env

const options = {
  useNewUrlParser  : true,
  reconnectTries   : 10,
  reconnectInterval: 500,
  connectTimeoutMS : 1000,
  useCreateIndex   : true
}

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?replicaSet=${MONGO_REPLICASET}&authSource=admin`


const connectWithRetry = function() {
  return mongoose.connect(url, options, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying...', err)
      setTimeout(connectWithRetry, options.connectTimeoutMS)
    }
  })
}
connectWithRetry()
