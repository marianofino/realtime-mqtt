const Publisher = require('../../publisher.class')
const MAX_FLOW = 150
const MIN_FLOW = 145

/* client 1: publishes pump flow */

let sensor_1 = new Publisher({ broker: 'mqtt://127.0.0.1:1883', id: 'sensor-1', topic: 'pumpFlow', period: 1 }, true)

// add fake latency as if the packet has been sent 2 minutes before
sensor_1.setSimulatedLatency(2)

sensor_1.getPayload = function () {
  return getPumpFlow()
}

function getPumpFlow() {
  return (Math.random() * (MAX_FLOW - MIN_FLOW) + MIN_FLOW).toFixed(2)
}
