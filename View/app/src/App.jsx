import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import "./App.css";

export default function Home() {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState({
    companyname: "",
    address: "",
    mobile: "",
    name: "",
    gst: "",
    pan: "",
    invoiceNumber: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    totalAmount: 0,
    dateIssued: null,
  });

  useEffect(() => {
    fetchInvoices();
    fetchProducts();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/invoices");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/products");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8086/api/invoices/${id}`, {
        method: "DELETE",
      });
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== id)
      );
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setInvoice((prev) => {
      const updatedItems = prev.items.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedInvoice = {
        ...invoice,
        dateIssued: invoice.dateIssued
          ? format(invoice.dateIssued, "dd-MM-yyyy")
          : "null",
      };
      const response = await fetch("http://localhost:8086/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedInvoice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("🚨 Submission Error:", errorData);
        return;
      }

      await response.json();
      window.location.reload();
    } catch (error) {
      console.error("🚨 Error submitting invoice:", error);
    }
  };

  const numberToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const thousands = ["", "Thousand", "Million", "Billion"];

    if (num === 0) return "Zero";

    let words = "";
    let thousandCounter = 0;

    while (num > 0) {
      let chunk = num % 1000;
      if (chunk > 0) {
        let chunkWords = "";
        let hundreds = Math.floor(chunk / 100);
        chunk = chunk % 100;

        if (hundreds > 0) {
          chunkWords += units[hundreds] + " Hundred ";
        }

        if (chunk > 0) {
          if (chunk < 10) {
            chunkWords += units[chunk];
          } else if (chunk < 20) {
            chunkWords += teens[chunk - 10];
          } else {
            let ten = Math.floor(chunk / 10);
            let unit = chunk % 10;
            chunkWords += tens[ten] + (unit > 0 ? " " + units[unit] : "");
          }
        }

        words =
          chunkWords +
          (thousandCounter > 0 ? " " + thousands[thousandCounter] : "") +
          (words ? " " + words : "");
      }
      num = Math.floor(num / 1000);
      thousandCounter++;
    }

    return words + " Only";
  };

  const downloadInvoicePDF = (invoice) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text("DIGITAL ADS", 20, 20);
    doc.setTextColor(244, 81, 30);
    doc.text("TAX INVOICE", 90, 20, { align: "center" });
    doc.setTextColor(76, 175, 80);
    doc.text("WEB,SEO & G-List", 190, 20, { align: "right" });
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    doc.setTextColor(0, 0, 0);

    let y = 40;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 150, 243);
    doc.text("CUSTOMER DETAILS", 20, y);
    doc.text("DIGI ADS DETAILS", 110, y);
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(0.2);
    doc.line(20, y + 2, 90, y + 2);
    doc.line(110, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.setTextColor(33, 150, 243);
    doc.text("BILLING NAME: ", 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.name}`, 50, y);

    y += 6;
    doc.setTextColor(33, 150, 243);
    doc.text("PHONE: ", 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.mobile}`, 50, y);

    y += 6;
    doc.setTextColor(33, 150, 243);
    doc.text("PAN No: ", 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.pan}`, 50, y);

    y += 6;
    doc.setTextColor(33, 150, 243);
    doc.text("GST No: ", 20, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.gst}`, 50, y);

    y = 48;
    doc.setTextColor(76, 175, 80);
    doc.text("DATE: ", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.dateIssued || "null"}`, 130, y);

    y += 6;
    doc.setTextColor(76, 175, 80);
    doc.text("INVOICE NO: ", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice.invoiceNumber}`, 140, y);

    y += 6;
    doc.setTextColor(76, 175, 80);
    doc.text("Digi ads BILLING ADDRESS: ", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text("2nd Floor Tarnaka", 160, y);

    y += 6;
    doc.setTextColor(76, 175, 80);
    doc.text("", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text("Near Metro park, Hyderabad, Telangana-500036", 110, y);

    y += 6;
    doc.setTextColor(76, 175, 80);
    doc.text("SAC CODE: ", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text("998365", 130, y);

    y += 6;
    doc.setTextColor(76, 175, 80);
    doc.text("REVERSE CHARGE: ", 110, y);
    doc.setTextColor(0, 0, 0);
    doc.text("No", 160, y);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text("BEING AMOUNT PAID FOR LISTING ON DIGI ADS", 20, y);
    doc.setDrawColor(33, 150, 243);
    doc.line(20, y + 2, 190, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(200, 230, 255);
    doc.rect(20, y - 4, 170, 8, "F");
    doc.setTextColor(0, 0, 0);
    doc.text("Category Count", 20, y);
    doc.text("Payment", 70, y);
    doc.text("Amount (Rs)", 150, y, { align: "right" });
    doc.setDrawColor(76, 175, 80);
    doc.line(20, y + 2, 190, y + 2);

    let netAmount = 0;
    invoice.items.forEach((item) => {
      netAmount += item.quantity * item.price;
    });
    const gstRate = 0.18;
    const gst = netAmount * gstRate;
    const totalAmount = netAmount + gst;

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `${invoice.items.length} (${
        numberToWords(invoice.items.length).split(" Only")[0]
      })`,
      20,
      y
    );
    doc.text("Gross Product Amount", 70, y);
    doc.text(`${netAmount.toFixed(2)}`, 150, y, { align: "right" });

    y += 5;
    doc.text("", 20, y);
    doc.text("Net Amount", 70, y);
    doc.text(`${netAmount.toFixed(2)}`, 150, y, { align: "right" });

    invoice.items.forEach((item, index) => {
      y += 5;
      doc.text(`Product ${index + 1}`, 20, y);
      doc.text(`${item.description}`, 70, y);
      doc.text(`Qty: ${item.quantity}, Price: ₹${item.price}`, 100, y);
      doc.text("", 150, y, { align: "right" });
    });

    y += 10;
    doc.text("", 20, y);
    doc.text("GST (18%)", 70, y);
    doc.setTextColor(244, 81, 30);
    doc.text(`${gst.toFixed(2)}`, 150, y, { align: "right" });
    doc.setTextColor(0, 0, 0);

    y += 5;
    doc.text("", 20, y);
    doc.text("TOTAL GST (18%)", 70, y);
    doc.setTextColor(244, 81, 30);
    doc.text(`${gst.toFixed(2)}`, 150, y, { align: "right" });
    doc.setTextColor(0, 0, 0);

    y += 5;
    doc.text("", 20, y);
    doc.text("TDS", 70, y);
    doc.text("0", 150, y, { align: "right" });

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("", 20, y);
    doc.text("TOTAL AMOUNT AFTER GST", 70, y);
    doc.setTextColor(76, 175, 80);
    doc.text(`${totalAmount.toFixed(2)}`, 150, y, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(76, 175, 80);
    doc.line(20, y + 2, 190, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(33, 150, 243);
    doc.text(`${numberToWords(Math.round(totalAmount))}`, 20, y);
    doc.setTextColor(0, 0, 0);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text("RELATIONSHIP MANAGER", 20, y);
    doc.setDrawColor(33, 150, 243);
    doc.line(20, y + 2, 190, y + 2);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Anil", 20, y);
    y += 6;
    doc.text("rds.digiads.com", 20, y);
    y += 6;
    doc.text(
      "For all TDS deductions, form 16A shall be sent at rds.digiads.com",
      20,
      y
    );
    y += 6;
    doc.text(
      "Payment received against this invoice confirms your acceptance to the Terms of Use",
      20,
      y
    );
    y += 6;
    doc.text(
      "available at rds.digiads.com/Terms-of-Use/Listing Services",
      20,
      y
    );

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 150, 243);
    doc.text("BASIC TERMS & CONDITIONS (LISTING SERVICE)", 20, y);
    doc.setDrawColor(33, 150, 243);
    doc.line(20, y + 2, 190, y + 2);

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(
      "1. Contract duration is one year or more, unless otherwise determined by the parties under this agreement/contract.",
      20,
      y
    );

    y += 20;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y, 170, 10, "F");
    doc.setDrawColor(33, 150, 243);
    doc.line(20, y, 190, y);
    doc.setFontSize(10);
    doc.setTextColor(33, 150, 243);
    doc.text("Digi ads", 20, y + 5);
    doc.setTextColor(76, 175, 80);
    doc.text("WEB,SEO & G-List", 190, y + 5, { align: "right" });

    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="container">
      <h2>Create New Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="companyname"
          placeholder="Company Name"
          onChange={(e) =>
            setInvoice({ ...invoice, companyname: e.target.value })
          }
          value={invoice.companyname}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={(e) => setInvoice({ ...invoice, address: e.target.value })}
          value={invoice.address}
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          onChange={(e) => setInvoice({ ...invoice, mobile: e.target.value })}
          value={invoice.mobile}
        />
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          onChange={(e) => setInvoice({ ...invoice, name: e.target.value })}
          value={invoice.name}
        />
        <input
          type="text"
          name="gst"
          placeholder="GST"
          onChange={(e) => setInvoice({ ...invoice, gst: e.target.value })}
          value={invoice.gst}
        />
        <input
          type="text"
          name="pan"
          placeholder="PAN"
          onChange={(e) => setInvoice({ ...invoice, pan: e.target.value })}
          value={invoice.pan}
        />
        <input
          type="text"
          name="invoiceNumber"
          placeholder="Invoice #"
          onChange={(e) =>
            setInvoice({ ...invoice, invoiceNumber: e.target.value })
          }
          value={invoice.invoiceNumber}
        />
        <div>
          <label htmlFor="dateIssued">Date Issued: </label>
          <DatePicker
            selected={invoice.dateIssued}
            onChange={(date) => setInvoice({ ...invoice, dateIssued: date })}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select date"
            isClearable
            showYearDropdown
            scrollableYearDropdown
            maxDate={new Date()}
          />
        </div>
        <h3>Invoice Items:</h3>
        {invoice.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="description"
              placeholder="Description"
              onChange={(e) => handleItemChange(index, e)}
              value={item.description}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              onChange={(e) => handleItemChange(index, e)}
              value={item.quantity}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={(e) => handleItemChange(index, e)}
              value={item.price}
            />
          </div>
        ))}
        <button type="button" onClick={addItem}>
          ➕ Add Item
        </button>
        <button type="submit">Create Invoice</button>
      </form>
      <h1>Invoice Management</h1>
      {invoices.length === 0 ? (
        <p>No invoices available.</p>
      ) : (
        invoices.map((invoice) => (
          <div key={invoice._id} className="invoice">
            <h2>{invoice.companyname}</h2>
            <p>
              <strong>Address:</strong> {invoice.address}
            </p>
            <p>
              <strong>Mobile:</strong> {invoice.mobile}
            </p>
            <p>
              <strong>Client Name:</strong> {invoice.name}
            </p>
            <p>
              <strong>GST:</strong> {invoice.gst}
            </p>
            <p>
              <strong>PAN:</strong> {invoice.pan}
            </p>
            <p>
              <strong>Invoice #:</strong> {invoice.invoiceNumber}
            </p>
            <p>
              <strong>Date Issued:</strong> {invoice.dateIssued}
            </p>
            <h3>Items:</h3>
            {invoice.items?.length > 0 ? (
              invoice.items.map((item, index) => (
                <p key={index}>
                  <strong>Description:</strong> {item.description} |
                  <strong>Quantity:</strong> {item.quantity} |
                  <strong>Price:</strong> ₹{item.price}
                </p>
              ))
            ) : (
              <p>No items in this invoice.</p>
            )}
            <button
              className="delete-btn"
              onClick={() => handleDelete(invoice._id)}
            >
              Delete
            </button>
            <button
              className="download-btn"
              onClick={() => downloadInvoicePDF(invoice)}
            >
              Download PDF
            </button>
          </div>
        ))
      )}
      Lootcamp
    </div>
  );
}
