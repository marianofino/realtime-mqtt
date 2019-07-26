const Publisher = require('../../publisher.class')
const MAX_TIME = 100
const MIN_TIME = 90

/* client 1: publishes time it takes the machine to cover all the field */

let sensor_1 = new Publisher({ broker: 'mqtt://127.0.0.1:1883', id: 'sensor-1', topic: 'time', period: 1 }, true)

sensor_1.getPayload = function () {
  return getTime()
}

function getTime() {
  return (Math.random() * (MAX_TIME - MIN_TIME) + MIN_TIME).toFixed(2)
}
