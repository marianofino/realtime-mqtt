# What is IRTA

For details about IRTA and modifications done on MQTT, please refer to the PDF found in this repository. There is an [online demo](http://192.241.222.173:4101/demo/) available too.

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

## Editing IRTA function

```
function lambda (irta, packet) {
  // do something
  return true
}
```

The function receives 2 arguments:
* The first one is the irta object
* The second one is the packet to be analyzed and processed

The payload can be found at `packet.payload` and is in `Buffer` type. In case we want to process and replace the payload of the current message, we need to overwrite it. If we want to prevent that message from being sent, we return `false`, otherwise we return `true`.


# Troubleshooting

## Error: listen EADDRINUSE :::1883

This means that the port 1883 is being used by other process. Probably you have another MQTT broker running (Mosquitto?). Make sure to either stop that process or change the broker port (found on `settings` in the broker file).
