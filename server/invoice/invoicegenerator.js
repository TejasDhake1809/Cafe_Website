// invoiceGenerator.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // 👉 Load a font that supports ₹
      const fontPath = path.resolve("fonts", "NotoSans-Regular.ttf"); 
      doc.font(fontPath);

      // --- Header ---
      doc.fontSize(20).text("Cafe Velvet Roast Invoice", { align: "center" });
      doc.moveDown();

      // --- Customer Info ---
      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Customer: ${order.email}`);
      doc.text(`Address: ${order.address}`);
      doc.text(`Payment Type: ${order.payment_type}`);
      doc.moveDown();

      // --- Items Table ---
      doc.fontSize(14).text("Items", { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item) => {
        doc.fontSize(12).text(
          `${item.name} : (${item.count} x ₹${item.price}) = ₹${item.count * item.price}`
        );
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total: ₹${order.price}`, { align: "right" });

      // --- Footer ---
      doc.moveDown(2);
      doc.fontSize(10).text("Thank you for your order!", { align: "center" });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
