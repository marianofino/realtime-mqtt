const Publisher = require('../../publisher.class')

/* client 1: publishes temperature according to pressure and  */

let sensor_1 = new Publisher({ broker: 'mqtt://127.0.0.1:1883', id: 'sensor-1', topic: 'temperature', period: 1 }, true)

sensor_1.getPayload = function () {
  return '30'
}
