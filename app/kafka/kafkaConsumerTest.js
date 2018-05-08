var kafkaClient = require("./kafkaClient");

kafkaClient.suscribe(function(message) {
    console.log(message);
});
