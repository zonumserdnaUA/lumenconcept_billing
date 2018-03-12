var billingQueue = require("../queue/billingQueue");
var billingDB = require("../db/billingDB");
var userDB = require("../db/userDB");

billingQueue.suscribe(function(sOrder) {
    // console.log("received order", sOrder);
    var order = JSON.parse(sOrder);
    verifyFunds(order.order);
});

function verifyFunds(order) {
    var items = order.items;
    var totalPrice = 0;

    items.forEach(function(item) {
        totalPrice = totalPrice + (item.amount*item.price);
    });

    userHasFunds(totalPrice, order.userId, function(hasFunds, funds) {
        if (hasFunds) {
            updateUserFunds(order.userId, getNetPrice(totalPrice), funds, function () {
                createBill(order, totalPrice);
                notifyBillingSucceeded(order.id_order);
            });
        } else {
            notifyBillingFailed(order.id_order);
        }
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

function createBill(order, totalPrice) {
    var billId = generateBillId();
    var createdDate = getCurrentDate();
    var iva = getIva();
    var netPrice = getNetPrice(totalPrice);

    var bill = {
        ID: billId,
        bill_number: billId,
        createdDate: createdDate,
        iva: iva,
        grossPrice: totalPrice,
        netPrice: netPrice,
        order: order
    };

    billingDB.createBill(bill);
}

function notifyBillingSucceeded(orderId) {
    var data = {
        state: true,
        reason: "Order registered successfully",
        id_order: orderId
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

function generateBillId() {
    return "" + Math.floor((Math.random() * 10000) + 1);
}

function getCurrentDate() {
    var now = new Date();
    return now.toISOString();
}

function getIva() {
    return 19;
}

function getNetPrice(grossPrice) {
    return (1 + (getIva() / 100)) * grossPrice;
}

function updateUserFunds(userId, totalPrice, funds, callback) {
    userDB.updateUserFunds(userId, funds - totalPrice, function () {
        callback();
    });
}