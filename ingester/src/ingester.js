const { PubSub } = require('@google-cloud/pubsub')
const ps = new PubSub()
const db = require('./config/db')
const TripModel = require('./models/trip')
const config = require('./config/config')

const { pubsub: { maxInProgress } } = config

const subscriberOptions = {
  flowControl: {
    maxMessages: maxInProgress,
  }
}
//TODO: make topic & subscription name configurable
const topic = 'projects/pubsub-public-data/topics/taxirides-realtime'
const subscriptionName = 'trips'

run()

async function run() {
  const createSubscription = async () => {
    const matchSubscriptionAndTopic = (s) => {
      if (s.length === 0) { return false }
      return s[0].name.split("/").reverse()[0] === subscriptionName &&
             s[0].metadata.topic === topic
    }

    const [subscriptions] = await ps.getSubscriptions()

    if (!(matchSubscriptionAndTopic(subscriptions))) {
      const subscription = await ps.topic(topic).createSubscription(subscriptionName)
      console.log(`Subscription ${subscriptionName} created.`)
    }
  }
  await createSubscription()
  const listener = ps.subscription(subscriptionName, subscriberOptions)
  console.info(`Subscriber to subscription ${subscriptionName} is ready to receive messages at a controlled volume of ${maxInProgress} messages.`)

  const saveToDB = async (document) => {
    //TODO: Create outer iterator to write in batches
    await TripModel.collection.insertMany([document])
  }
  const mapMessageToModel = (message) => {
    return {
      ride_id: message.ride_id,
      point_idx: message.point_idx,
      latitude: message.latitude,
      longitude: message.longitude,
      timestamp: new Date(message.timestamp).toISOString(),
      meter_reading: message.meter_reading,
      meter_increment: message.meter_increment,
      ride_status: message.ride_status,
      passenger_count: message.passenger_count
    }
  }

  const messageHandler = async (message) => {
    try {
      const decoded = JSON.parse(Buffer.from(message.data, 'base64').toString('ascii'))
      const mapped = mapMessageToModel(decoded)
      console.log(mapped)
      await saveToDB(mapped)
      message.ack()
    } catch (error) {
      console.error(error)
    }
  }

  const errorHandler = error => {
    console.error(error)
  }

  listener.on(`message`, messageHandler)
  listener.on(`error`, errorHandler)
}
