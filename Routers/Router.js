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



router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});



module.exports = router;