// require("./app/app");

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    salesQueue            = require("./app/queue/salesQueue"),
    salesCompensatorQueue = require("./app/queue/salesCompensatorQueue");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);

// API routers
var datos = express.Router();

datos.post('/api/bill/register', function (req, res) {
    salesQueue.notify(req.body, function (data) {
        res.send({
            version: 1,
            mensaje: "Microservice sent: " + data,
            success: true
        });
    });
});

datos.post('/api/bill/compensate', function (req, res) {
    salesCompensatorQueue.notify(req.body, function (data) {
        res.send({
            version: 1,
            mensaje: "Microservice compensate sent: " + data,
            success: true
        });
    });
});

salesQueue.suscribe(function(sOrderState) {
    console.log("sOrderState ====>", sOrderState);
});

app.use('/', datos);

// Start Server
app.listen(3010, function(){
	console.log("Server running on http://localhost:3010");
});