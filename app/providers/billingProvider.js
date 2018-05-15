var billingQueue = require("../queue/billingQueue");
var selfAdaptabilityQueue = require("../queue/selfAdaptabilityQueue");
var userDB = require("../db/userDB");
var billingUtil = require("../util/billingUtil");
var billingDB = require("../db/billingDB");

billingQueue.suscribe(function(sOrder) {
    var order = JSON.parse(sOrder);
    order = order.order;
    billingUtil.createBill(order, billingUtil.calculateTotalPrice(order.items), function(bill) {
        selfAdaptabilityQueue.notify(bill, function() {});
    });
});

selfAdaptabilityQueue.suscribe(function(billId) {
    verifyFunds(billId);
});

function verifyFunds(billId) {
    billingDB.getBill("" + billId, function (bill) {
        var totalPrice = bill.grossPrice;
        var order = bill.order;

        userHasFunds(totalPrice, order.userId, function(hasFunds, funds) {
            if (hasFunds) {
                updateUserFunds(order.userId, billingUtil.getNetPrice(totalPrice), funds, function () {
                    notifyBillingSucceeded(order.id_order, bill.ID);
                });
            } else {
                notifyBillingFailed(order.id_order);
            }
        });
    });
}

function userHasFunds(totalPrice, userId, callback) {
    userDB.getUser(userId, function (user) {
        var hasFunds = false;
        if (user.funds >= totalPrice) {
            hasFunds = true;
        }
        callback(hasFunds, user.funds);
    });
}

function notifyBillingSucceeded(orderId, billId) {
    var data = {
        state: true,
        reason: "Order registered successfully",
        id_order: orderId,
        id_bill: billId
    };
    billingQueue.notify(data);
}

function notifyBillingFailed(orderId) {
    var data = {
        state: false,
        reason: "No funds",
        id_order: orderId
    };
    billingQueue.notify(data);
}

function updateUserFunds(userId, totalPrice, funds, callback) {
    userDB.updateUserFunds(userId, funds - totalPrice, function () {
        callback();
    });
}