const express = require("express");
const {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
} = require("../Controller/InvoiceController"); 

const router = express.Router();

// CRUD Routes
router.get("/invoices", getInvoices); 
router.get("/invoices/:id", getInvoiceById); 
router.post("/invoices", createInvoice); 
router.put("/invoices/:id", updateInvoice); 
router.delete("/invoices/:id", deleteInvoice); 

module.exports = router;