const Subscriber = require('../../subscriber.class')

/* client 3: subscribes to topic applicationRate */

let sub = new Subscriber({ broker: 'mqtt://127.0.0.1:1883', id: 'subscriber-1', topic: 'applicationRate', period: 1, latency: 10 }, true)

sub.on('message', function (topic, message) {
  // do something with message
  console.log('Received application rate: ' + message.toString() + ' mm')
})


