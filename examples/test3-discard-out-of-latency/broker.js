const mosca = require('mosca');
const IRTA = require('../../irta')
const myFunction = require('./lambda')

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

irta.setFunction(myFunction)

// fired when the mqtt server is ready
server.on('ready', function() {
  console.log('MQTT broker is up and running');
});
