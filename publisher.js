const mqtt = require('mqtt');

let options = {
  clientId: 'hola-1'
}

let topicParams = {
  period: 17,
  timestamp: 1516742614
}

let client = mqtt.connect('mqtt://127.0.0.1:1883', options);

client.on('connect', function () {

  client.register('presence', topicParams);

  setInterval(() => {
    client.publish('presence', 'Hello mqtt')
  }, 1000);
})
