require("./app/app");

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    methodOverride        = require("method-override"),
    salesQueue            = require("./app/queue/salesQueue"),
    billingQueue            = require("./app/queue/billingQueue")

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

var _res = null;

datos.post('/api/bill/register', function (req, res) {
    _res = res;
    salesQueue.notify(req.body, function (data) {
    });
});

billingQueue.suscribePaymentState(function (response) {
    _res.send(response);
});

app.use('/', datos);

// Start Server
app.listen(3010, function() {
	console.log("Server running on http://localhost:3010");
});
