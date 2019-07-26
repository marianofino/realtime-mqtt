## Example: Discard messages not needed by subscriber because of different latency

### Overview

In this example there is a publisher sending a message with a simlated latency of 2 minutes under the topic *pumpFlow* and the subscriber expecting messages under the same topic, but with a latency not greater than 1 minute. Thus, the broker with IRTA discards all the messages because they don't meet the latency requirements of the broker.

### Instructions

1. On the root folder, run:

```
$ npm rebuild
```

2. Go to examples/test1-merging-2-topics

3. Open a terminal and run the broker:

```
$ node broker.js
```

4. Open another terminal and run the subscriber:

```
$ node subscriber.js
```

5. Open another terminal and run one publisher:

```
$ node sensor1_pumpFlow.js
```

7. Every 3 minutes you should see at the subscriber terminal that a message is received.
