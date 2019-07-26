const Subscriber = require('../../subscriber.class')

/* client 3: subscribes to topic pumpFlow */

let sub = new Subscriber({ broker: 'mqtt://127.0.0.1:1883', id: 'subscriber-1', topic: 'pumpFlow', period: 1, latency: 1 }, true)

sub.on('message', function (topic, message) {
  // do something with message
  console.log('Received application rate: ' + message.toString() + ' mm')
})


