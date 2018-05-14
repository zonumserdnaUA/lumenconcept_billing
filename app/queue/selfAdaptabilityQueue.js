var amqp = require('amqplib/callback_api');
var executePaymentQueue = "selfAdaptability.execute.payment";
var monitorPaymentQueue = "selfAdaptability.monitor.payment";
var queueURL = "amqp://vgleryqm:kwDm7WnQvfqeA4RX1DZXfmT-DWTxC3bu@skunk.rmq.cloudamqp.com/vgleryqm";

// public methods

exports.suscribe = suscribe;
exports.notify = notify;

// private methods

function suscribe(callback) {
    amqp.connect(queueURL, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = executePaymentQueue;
            ch.assertQueue(q, {durable: false});
            ch.consume(q, function(msg) {
                console.log("__SelfAdaptability success payment request received", msg.content.toString(), "\n");
                callback(msg.content.toString());
            }, {noAck: true});

            console.log("__SelfAdaptability queue connection successful\n");
        });
    });
}

function notify(data, callback) {
    amqp.connect(queueURL, function(err, conn) {
        conn.createChannel(function(err, ch) {
            var q = monitorPaymentQueue;
            ch.assertQueue(q, {durable: false});
            var sData = JSON.stringify(data);
            console.log("__SelfAdaptability monitor payment sending to...", monitorPaymentQueue, "\n");
            ch.sendToQueue(q, new Buffer(sData));
            console.log("__SelfAdaptability monitor payment status sent", data, "\n");
            if (callback) callback(data);
        });
    });
}
