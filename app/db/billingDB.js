var AWS = require('aws-sdk');
var tableName = "Billing";
var DBKeys = require("./DBKeys");

AWS.config.update({
    accessKeyId: DBKeys.getAccessKeyId(),
    secretAccessKey: DBKeys.getSecretAccessKey(),
    region: 'us-east-2'
});

var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// public methods
exports.createBill = createBill;

// private methods
function createBill(bill, callback) {
    var params = {
        TableName: tableName,
        Item: bill
    };
    docClient.put(params, function(err, data) {
        if (err) console.log(err);
        else {
            console.log("__Billing bill created successfully", bill);
            if(callback) callback();
        }
    });
}