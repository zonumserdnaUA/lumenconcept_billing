var amqp = require('amqplib/callback_api');
var requestQueue = "billing1.request";
var responseQueue = "billing1.response";
var queueURL = "amqp://vgleryqm:kwDm7WnQvfqeA4RX1DZXfmT-DWTxC3bu@skunk.rmq.cloudamqp.com/vgleryqm";

// public methods

exports.suscribe = suscribe;
exports.notify = notify;

// private methods

function suscribe(callback) {
    amqp.connect(queueURL, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = responseQueue;
            ch.assertQueue(q, {durable: false});
            ch.consume(q, function(msg) {
                // console.log("msg", msg.content.toString());
                callback(msg.content.toString());
            }, {noAck: true});

            console.log("Sales Queue connection successful");
        });
    });
}

function notify(data, callback) {
    amqp.connect(queueURL, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = requestQueue;
            ch.assertQueue(q, {durable: false});
            ch.sendToQueue(q, new Buffer(JSON.stringify(data)));
            console.log(" __Sales [x] Sent " + data);
            callback(data);
        });
    });
}