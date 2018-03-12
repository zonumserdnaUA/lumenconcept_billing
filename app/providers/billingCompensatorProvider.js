var billingCompensatorQueue = require("../queue/billingCompensatorQueue");
var billingDB = require("../db/billingDB");
var userDB = require("../db/userDB");

billingCompensatorQueue.suscribe(function(sBillIdentifier) {
    var billIdentifier = JSON.parse(sBillIdentifier);
    getBill(billIdentifier.id_bill, function (bill) {
        compensateUser(bill, function() {
            compensateBilling(bill, function() {
                notifyBillingCompensationSuccess(bill.order.id_order);
            });
        });
    });
});

// private methods

function getBill(billId, callback) {
    billingDB.getBill("" + billId, function (bill) {
        callback(bill);
    });
}

function compensateUser(bill, callback) {
    userDB.getUser(bill.order.userId, function(user) {
        var userFunds = user.funds;
        var netPrice = bill.netPrice;
        userDB.updateUserFunds("" + user.ID, userFunds + netPrice, function() {
            callback();
        });
    });
}

function compensateBilling(bill, callback) {
    billingDB.deleteBill(bill.ID, function() {
        callback();
    });
}

function notifyBillingCompensationSuccess(orderId) {
    var data = {
        state: true,
        reason: "Billing compensated successfully",
        id_order: orderId
    };

    billingCompensatorQueue.notify(data);
}