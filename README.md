# What is IRTA

For details about IRTA and modifications done on MQTT, please refer to the PDF found in this repository.

## Examples

### Merging 2 topics into 1 using IRTA function

In this example we will use a feature of IRTA which consists on merging, at broker level, two incoming messages and transforming them into one single message by applying a custom function to them.

Go to **examples/test1-merging-2-topics**

### Discard messages not needed by subscriber because of different period

In this example there is a publisher sending a message every 1 minute under the topic *pumpFlow* and the subscriber expecting messages under the same topic, but every 3 minutes. Thus, the broker with IRTA discards 2 out of 3 messages because they are not needed.

Go to **examples/test2-discard-out-of-period**

### Discard messages not needed by subscriber because of different latency

In this example there is a publisher sending a message with a simlated latency of 2 minutes under the topic *pumpFlow* and the subscriber expecting messages under the same topic, but with a latency not greater than 1 minute. Thus, the broker with IRTA discards all the messages because they don't meet the latency requirements of the broker.

Go to **examples/test3-discard-out-of-latency**

## Requirements

* Node.js (tested with v10.14.1): https://nodejs.org/es/download/
* Tested on Linux

## How to use IRTA?

IRTA is based on the MQTT protocol, but it modifies its packet structure and flow to be able to meet time and functional requirements. For this reason, popular JS libraries and modules have been modified. For the moment, these are found inside the `node_modules` folder, so you need to rebuild them so they can work on your architecture. 1. On the root folder, run:

```
$ npm rebuild
```

Once rebuilt, you are able to create a broker using Mosca and IRTA, and subscribers and publishers. Please, refer to the examples section to see how this is done.

# Troubleshooting

## Error: listen EADDRINUSE :::1883

This means that the port 1883 is being used by other process. Probably you have another MQTT broker running (Mosquitto?). Make sure to either stop that process or change the broker port (found on `settings` in the broker file).
