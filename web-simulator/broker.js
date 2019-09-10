const mosca = require('mosca');
const IRTA = require('../irta')
const http = require('http')

// IRTA agent function
let lambdaStr = "function lambda () { return true }"
eval(lambdaStr)

var express = require('express');
var app = express();

app.use(express.json())

app.get('/lambda', function (req, res) {
  res.send(lambdaStr);
});

app.post('/lambda', (req, res) => {
  lambdaStr = req.body.fn
  console.log(lambdaStr)
  eval(lambdaStr)
  irta.setFunction(lambda)
  res.send('ok');
});

app.listen(4101, function () {
  console.log('Example app listening on port 4101!');
});

app.use('/demo', express.static('public'));

let settings = {
  port: 1883,
  http: {
    port: 4100,
    bundle: true,
    static: './'
  }
}

let server = new mosca.Server(settings);

let irta = new IRTA(server)

irta.setFunction(lambda)

// fired when the mqtt server is ready
server.on('ready', function() {
  console.log('MQTT broker is up and running');
})
