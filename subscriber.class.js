const mqtt = require('mqtt')

function Subscriber(settings, debug) {

  if (typeof settings.broker == "undefined" || typeof settings.id == "undefined" || typeof settings.topic == "undefined" || typeof settings.period == "undefined" || typeof settings.latency == "undefined")
    throw new Error('Missing mandatory param')

  let _self = this
  let _period = settings.period
  let _latency = settings.latency
  let _id = settings.id
  let _topic = settings.topic

  let _client = mqtt.connect(settings.broker)

  _client.on('connect', function () {
    _client.subscribe(_topic, { period: _period, latency: _latency })
    if (debug)
      console.log('Debug ON for client')
  })

  _client.on('message', function (topic, message) {
    // message is Buffer
    console.log('[' + parseTime(getCurrentTime()) + '] Receives packet with topic \"' + topic + '\" and payload: ' + message.toString())
  })

  return _client

}

function getCurrentTime() {
  return parseInt(Date.now() / 1000 / 60)
}

function parseTime(time) {
  let d = new Date(time*1000*60)
  return d.getFullYear() + '/' + pad((d.getMonth() + 1),2) + '/' + pad(d.getDate(),2) + ' ' + d.getHours() + ':' + pad(d.getMinutes(), 2)
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

module.exports = Subscriber
