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
exports.getBill = getBill;
exports.deleteBill = deleteBill;

// private methods
function createBill(bill, callback) {
    var params = {
        TableName: tableName,
        Item: bill
    };
    docClient.put(params, function(err, data) {
        if (err) console.log(err);
        else {
            console.log("__BILLING bill created successfully", bill);
            if(callback) callback();
        }
    });
}

// private methods
function getBill(billId, callback) {
    var params = {
        TableName: tableName,
        Key: {"ID": billId}
    };

    console.log("params", params);

    docClient.get(params, function(err, data) {
        if (err) {
            console.log("__BILLING ERROR getting bill", err, "\n");
        } else {
            console.log("__BILLING SUCCEEDED getting bill", data.Item, "\n");
            if(callback) callback(data.Item);
        }
    });
}

function deleteBill(billId, callback) {
    var params = {
        TableName: tableName,
        Key: {"ID": billId}
    };

    docClient.delete(params, function(err, data) {
        if (err) {
            console.log("__BILLING ERROR deleting bill", err, "\n");
        } else {
            console.log("__BILLING SUCCEEDED deleting bill", data, "\n");
            if(callback) callback(data.Item);
        }
    });
}