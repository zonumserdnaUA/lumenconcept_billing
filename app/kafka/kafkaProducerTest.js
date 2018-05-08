var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var kafkaClient = require("./kafkaClient");

app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/',function(req,res){
    res.json({greeting:'Kafka Producer'})
});

app.post('/sendMsg',function(req,res){
    var sentMessage = JSON.stringify(req.body.message);
    kafkaClient.notify(sentMessage, function(data) {
        res.json(data);
    });
});

app.listen(5001,function(){
    console.log('Kafka producer running at 5001')
});
