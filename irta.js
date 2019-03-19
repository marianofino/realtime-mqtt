const mqtt = require('mqtt')

function IRTA (moscaServer) {

  let _self = this
  let topicsRegistered = {}
  let subscriptions = {}

  let client  = mqtt.connect('mqtt://127.0.0.1:1883')

  client.on('connect', function () {
    console.log('Debug ON for IRTA')
  })

  this.registerTopic = function (topic, topicParams) {
    if (topicsRegistered[topic]) {
      // topic exists
      // TODO: calculate new topic period
    } else {
      // new topic
      topicsRegistered[topic] = topicParams;
    }
  }

  this.registerSubscription = function (clientId, topic, topicParams) {
    // if client doesn't have any subscription add it
    if (!subscriptions[clientId])
      subscriptions[clientId] = { subscriptions: {} }
/*
    if (!clientsByTopics[topic])
      clientsByTopics[topic] = []

    clientsByTopics[topic].push(clientId)
*/
    // add subscription params
    subscriptions[clientId].subscriptions[topic] = topicParams
    subscriptions[clientId].subscriptions[topic].lastMessageTimestamp = null
    subscriptions[clientId].subscriptions[topic].currentLatency = getCurrentTime() - topicParams.timestamp
  }

  this.subscribe = function (topic, settings) {
    client.subscribe(topic, settings)
  }

  this.publishNewTopic = function (topic, message) {
    client.publish(topic, message, { timestamp: getCurrentTime() })
  }

  // override this function
  this.lambda = function () { return true }

  function getCurrentTime() {
    return parseInt(Date.now() / 1000 / 60)
  }

  /* SETUP MOSCA SERVER */

  moscaServer.on('topicRegistered', function(topic, topicParams) {
    _self.registerTopic(topic, topicParams)
  })

  moscaServer.on('subscribed', function(topic, topicParams, client) {
    _self.registerSubscription(client.id, topic, topicParams)
  })

  moscaServer.doPublish = function (packet, clientId) {
    // we have period, latency and client id; now run conditions to decide if packet is published or not

    // get topicParams
    let topicParams = subscriptions[clientId].subscriptions[packet.topic]

    if (!topicParams)
      return false

    // calculate latency between publisher and subscriber
    let projectedLatency = getCurrentTime() - packet.timestamp + topicParams.currentLatency
    if (projectedLatency > topicParams.latency) {
      console.log('Packet latency is not acceptable: ' + projectedLatency + ' (projected) vs ' + topicParams.latency + ' (expected)')
      console.log(getCurrentTime(), packet.timestamp, topicParams.currentLatency)
      return false
    }

    // only accepts packets with the same period as the one we expect
    if (topicParams.lastMessageTimestamp != null) {
      let period = packet.timestamp - topicParams.lastMessageTimestamp

      if (period != topicParams.period) {
        console.log('Packet period is not acceptable: ' + period + ' (projected) vs ' + topicParams.period + ' (expected)')
        console.log(packet.timestamp, topicParams.lastMessageTimestamp)

        if (period < 0)
          topicParams.lastMessageTimestamp = packet.timestamp

        return false
      }
    }

    topicParams.lastMessageTimestamp = packet.timestamp

    return true
  }

  moscaServer.lambda = function (packet) {
    return _self.lambda(packet)
  }

}

module.exports = IRTA
