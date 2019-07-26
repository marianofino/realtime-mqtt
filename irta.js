const mqtt = require('mqtt')
const MIN_PERIOD = 1
const MAX_LATENCY = 255

function IRTA (moscaServer) {

  let _self = this
  let topicsRegistered = {}
  let subscriptions = {}

  let topicsWatching = []

  let client  = mqtt.connect('mqtt://127.0.0.1:1883')

  client.on('connect', function () {
    console.log('Debug ON for IRTA')
  })

  this.isWatchingTopic = function (topic) {
    if (topicsWatching.indexOf(topic) >= 0)
      return true

    return false
  }

  this.watchTopics = function (topics) {
    if (!(topics instanceof Array))
      topics = [topics]

    for (var i=0; i < topics.length; i++) {
      var topic = topics[i]
      if (!_self.isWatchingTopic(topic)) {
        _self.subscribe(topic, { period: MIN_PERIOD, latency: MAX_LATENCY })
      }
    }
  }

  this.registerTopic = function (topic, topicParams) {
    this.watchTopics(topic)

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
    let t = getCurrentTime()
    console.log('[' + _parseTime(t) + '] Publish new message under topic: ' + topic)
    client.publish(topic, Buffer.from(message), { timestamp: t })
  }

  this.setFunction = function (fn) {
    moscaServer.lambda = function (packet) {
      return fn(_self, packet)
    } 
  }

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

  moscaServer.on('published', function(packet) {
    let t = getCurrentTime()
    console.log('[' + _parseTime(t) + '] Message received with topic: ' + packet.topic)
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
      //console.log(getCurrentTime(), packet.timestamp, topicParams.currentLatency)
      return false
    }

    // only accepts packets with the same period as the one we expect
    if (topicParams.lastMessageTimestamp != null) {
      let period = packet.timestamp - topicParams.lastMessageTimestamp

      if (period != topicParams.period) {
        console.log('Packet period is not acceptable: ' + period + ' (projected) vs ' + topicParams.period + ' (expected)')
        //console.log(packet.timestamp, topicParams.lastMessageTimestamp)

        if (period < 0)
          topicParams.lastMessageTimestamp = packet.timestamp

        return false
      }
    }

    topicParams.lastMessageTimestamp = packet.timestamp

    return true
  }

  function _parseTime(time) {
    let d = new Date(time*1000*60)
    return d.getFullYear() + '/' + pad((d.getMonth() + 1),2) + '/' + pad(d.getDate(),2) + ' ' + d.getHours() + ':' + pad(d.getMinutes(), 2)
  }

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

}

module.exports = IRTA
