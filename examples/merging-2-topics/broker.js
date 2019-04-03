const mosca = require('mosca');
const { parse } = require('querystring');
const IRTA = require('./irta')

let ascoltatore = {
  type: 'zmq',
  json: false,
  zmq: require("zeromq"),
  port: "tcp://127.0.0.1:33333",
  controlPort: "tcp://127.0.0.1:33334",
  delay: 10
}

let settings = {
  port: 1883,
  http: {
    port: 3000,
    bundle: true,
    static: './'
  }
}

let server = new mosca.Server(settings);

let irta = new IRTA(server)

let currentValues = {}

irta.subscribe('temperature', { period: 1, latency: 255 })
irta.subscribe('pressure', { period: 1, latency: 255 })

irta.lambda = function (packet) {

  let payload = packet.payload.toString()

  switch (packet.topic) {

    case 'temperature':
      
      if (currentValues.pressure) {
        let k = currentValues.pressure / parseFloat(packet.payload)
        let payload = Buffer.from(k.toString())
        delete currentValues.pressure
        irta.publishNewTopic('kConstant', payload)
      }

      currentValues.temperature = parseFloat(packet.payload)

      break

    case 'pressure':
      
      if (currentValues.temperature) {
        let k = currentValues.temperature / parseFloat(packet.payload)
        let payload = Buffer.from(k.toString())
        delete currentValues.temperature
        irta.publishNewTopic('kConstant', payload)
      }

      currentValues.pressure = parseFloat(packet.payload)

      break

    default:
      return true
      break

  }

  return false

}

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('MQTT broker is up and running');
}
