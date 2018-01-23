var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://127.0.0.1:1883')

let topicParams = {
  period: 10,
  latency: 20
}

client.on('connect', function () {
  client.subscribe('presence', topicParams)
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})
