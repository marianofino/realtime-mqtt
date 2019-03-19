var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://127.0.0.1:1883')

let topicParams = {
  period: 1,
  latency: 10
}

client.on('connect', function () {
  client.subscribe('kConstant', topicParams)
  console.log('Debug ON for client')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('[' + parseTime(getCurrentTime()) + '] Receives packet with topic \"' + topic + '\" and payload: ' + message.toString())
})

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
