const Invoice = require("../model/invoicedata"); 

// **Get all invoices**
const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: "Error fetching invoices" });
    }
};

// **Get a single invoice by ID**
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: "Error fetching invoice" });
    }
};

// **Create a new invoice**

const createInvoice = async (req, res) => {
    try {
        if (!req.body.companyname || !req.body.invoiceNumber) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(400).json({ error: "Error creating invoice", details: error.message });
    }
};

// **Update an invoice**
const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(400).json({ error: "Error updating invoice" });
    }
};

// **Delete an invoice**
const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting invoice" });
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
};