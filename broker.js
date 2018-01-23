var mosca = require('mosca');

var ascoltatore = {
  type: 'zmq',
  json: false,
  zmq: require("zeromq"),
  port: "tcp://127.0.0.1:33333",
  controlPort: "tcp://127.0.0.1:33334",
  delay: 10
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

let topics = {}
let subscriptions = {}

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
  //console.log(client);
  console.log('client connected', client.id);
});

server.on('topicRegistered', function(topic, topicParams, client) {
  addTopic(topic, topicParams);
});

server.on('subscribed', function(topic, topicParams, client) {
  addSubscription(client.id, topic, topicParams);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

let addSubscription = function (clientId, topic, topicParams) {
  // if client doesn't have any subscription add it
  if (!subscriptions[clientId])
    subscriptions[clientId] = { subscriptions: {} }

  // add subscription params
  subscriptions[clientId].subsctiptions[topic] = topicParams
}

let addTopic = function (topic, topicParams) {

  if (topics[topic]) {
    // topic exists
    // TODO: calculate new topic period
  } else {
    // new topic
    topics[topic] = topicParams;
  }
}

// if true, packet will be sent to client
server.doPublish = function (topic, clientId) {
  let publish = false;

  // get topicParams
  let topicParams = subscriptions[clientId].subsctiptions[topic]

  // TODO: we have period, latency and client id; now run conditions to decide if packet is published or not

  return publish;
}
