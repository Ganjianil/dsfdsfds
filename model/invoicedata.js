const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    companyname: { type: String, required: false },
    address: { type: String, required: false },
    mobile: { type: Number, required: false },
    name: { type: String, required: false },
    gst: { type: String, required: false },
    pan: { type: String, required: false },
    invoiceNumber: { type: String, required: false, unique: true },
    items: [{ description: String, quantity: Number, price: Number }],
    totalAmount: { type: Number, required: false },
    dateIssued: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", invoiceSchema);