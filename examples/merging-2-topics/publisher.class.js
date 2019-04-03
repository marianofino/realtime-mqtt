const mqtt = require('mqtt')

function Publisher(settings, debug) {

  if (typeof settings.broker == "undefined" || typeof settings.id == "undefined" || typeof settings.topic == "undefined" || typeof settings.period == "undefined")
    throw new Error('Missing mandatory param')

  let _self = this
  let _period = settings.period
  let _id = settings.id
  let _topic = settings.topic
  let _lastMessageTime = null

  console.log('Debug ON for client ' + _id)

  let _client = mqtt.connect(settings.broker, { period: _period, topic:_topic })

  _client.on('connect', function () {

    _client.register(_topic, { period: _period, timestamp: _getCurrentTime() })

    setInterval(() => {
      if (_isPeriod()) {
        let payload = _self.getPayload()
        let timestamp = _getCurrentTime()
        _client.publish(_topic, payload, { timestamp: timestamp })
        if (debug)
          console.log('[' + _parseTime(timestamp) + '] Packet sent with topic \"' + _topic + '\" and payload: ' + payload)
      }
    }, 500)

  })

  this.getPayload = function () {
    return 1
  }

  function _getCurrentTime() {
    return parseInt(Date.now() / 1000 / 60)
  }

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  function _parseTime(time) {
    let d = new Date(time*1000*60)
    return d.getFullYear() + '/' + pad((d.getMonth() + 1),2) + '/' + pad(d.getDate(),2) + ' ' + d.getHours() + ':' + pad(d.getMinutes(), 2)
  }

  function _isPeriod() {
    let time = _getCurrentTime()

    if (_lastMessageTime === null || time - _lastMessageTime == _period) {
      _lastMessageTime = time
      return true
    }
    return false
  }
}

module.exports = Publisher
