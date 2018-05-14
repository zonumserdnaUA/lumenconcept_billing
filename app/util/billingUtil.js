var billingDB = require("../db/billingDB");

// public methods

exports.calculateTotalPrice = calculateTotalPrice;
exports.createBill = createBill;
exports.getNetPrice = getNetPrice;

// private methods

function calculateTotalPrice(itemsInOrder) {
    var totalPrice = 0;

    itemsInOrder.forEach(function(item) {
        totalPrice = totalPrice + (item.amount*item.price);
    });

    return totalPrice;
}

function createBill(order, totalPrice, callback) {
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

    billingDB.createBill(bill, function() {
        callback(bill);
    });
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