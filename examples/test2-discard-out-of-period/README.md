## Example: Discard messages not needed by subscriber because of different period

### Overview

In this example there is a publisher sending a message every 1 minute under the topic *pumpFlow* and the subscriber expecting messages under the same topic, but every 3 minutes. Thus, the broker with IRTA discards 2 out of 3 messages because they are not needed.

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
