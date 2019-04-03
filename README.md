# Instructions

## Requirements

* Node.js (tested with v10.14.1): https://nodejs.org/es/download/

## Running the examples

### Merging 2 topics

In this example, there are 2 publishers sending messages with a different topic each, "pressure" and "temperature", and one subscriber subscribed to a third topic, "kConstant". The broker receives the topics published, processes them, and publishes a the topic expected by the subscriber. To run this example follow these steps:

1. Go to examples/merging-2-topics

2. Open a terminal and run the broker:

```
$ node broker.js
```

3. Open another terminal and run the subscriber:

```
$ node subscriber.js
```

4. Open another terminal and run one publisher:

```
$ node sensor1_temperature.js
```

5. Open another terminal and run the other publisher:

```
$ node sensor2_pressure.js
```

6. Every minute you should see at the subscriber terminal that the message generated by the broker is received.
