const Subscriber = require('../../subscriber.class')
const Publisher = require('../../publisher.class')

const MAX_N = 999999
const MIN_N = 1

window.addSubscriber = function (node) {

  if (!node.id) { alert('You must provide an id.'); return false }
  if (!node.topic) { alert('You must provide a topic.'); return false }
  if (!node.expPeriod) { alert('You must provide an expected period.'); return false }
  if (!node.expLat) { alert('You must provide an expected latency.'); return false }
  //if (!node.simNetLat) { alert('You must provide a simulated network latency.'); return false }

  let sub = new Subscriber({ broker: 'wxs://127.0.0.1:3000', id: 'subscriber-' + node.id, topic: node.topic, period: node.expPeriod, latency: node.expLat }, true)

  sub.on('message', function (topic, message) {
    // do something with message
    addLog(new Date().toISOString(), '[subscriber-' + node.id + '] Received message with topic \'' + node.topic + '\', value:' + message.toString())
  })

  return true

}

window.addPublisher = function (node) {

  if (!node.id) { alert('You must provide an id.'); return false }
  if (!node.topic) { alert('You must provide a topic.'); return false }
  if (!node.sendPeriod) { alert('You must provide a sending period.'); return false }
  //if (!node.simNetLat) { alert('You must provide a simulated network latency.'); return false }

  let pub = new Publisher({ broker: 'wxs://127.0.0.1:3000', id: 'publisher-' + node.id, topic: node.topic, period: node.sendPeriod }, true)

  pub.getPayload = function () {
    let m = getRandomNumber()
    addLog(new Date().toISOString(), '[publisher-' + node.id + '] Send message with topic \'' + node.topic + '\', value:' + m)
    return m
  }

  function getRandomNumber() {
    return (Math.random() * (MAX_N - MIN_N) + MIN_N).toFixed(2)
  }

  return true

}
