const PAYMETN_TOPIC = "lumenconcept.payment";

var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    // client = new kafka.Client(),
    client = new kafka.KafkaClient({kafkaHost: '157.253.238.226:8089'});
    consumer = new Consumer(client,
        [{ topic: PAYMETN_TOPIC, offset: 0}],
        {
            autoCommit: false
        }
    );

consumer.on('message', function (message) {
    console.log(message);
});

consumer.on('error', function (err) {
    console.log('Error:',err);
});

consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange:',err);
});