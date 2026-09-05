import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Formats currency safely for jsPDF without font encoding corruption.
 */
const formatPdfCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
};

/**
 * Generates and downloads a clean, professional restaurant receipt PDF.
 *
 * @param {Object} order - Complete order data including items, customer, table, and payment info.
 * @param {Object} [restaurantSettings] - Optional restaurant settings (name, address, phone).
 */
export const generateReceiptPDF = (order, restaurantSettings = {}) => {
    if (!order) return;

    // Use A5 portrait for clean receipt proportions (148 x 210 mm)
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
    });

    const restaurantName = restaurantSettings.restaurantName || "TableFlow Restaurant";
    const address = restaurantSettings.address || "123 Gourmet Street, Food District";
    const phone = restaurantSettings.phone || "+91 98765 43210";

    const orderNumber = order.orderNumber || "N/A";
    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "N/A";
    const orderTime = order.createdAt
        ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : "N/A";

    const customerName = order.customer?.name || "Guest Customer";
    const customerPhone = order.customer?.phone || "N/A";
    const members = order.customer?.members || 1;
    const tableNo = order.table?.tableNo ? `Table ${order.table.tableNo}` : "Take-away";
    const waiterName = order.waiter?.name || "Server";
    const paymentMethod = order.paymentMethod || "CASH";
    const isPaid = order.status === "COMPLETED";

    const tip = Number(order.tip || 0);
    const discount = Number(order.discount || 0);
    const subtotal = Number(order.subtotal || 0);
    const tax = Number(order.tax || 0);
    const finalTotal = Number(order.grandTotal || 0) + tip;

    // Margins & Dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 12;

    // 1. Header & Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(249, 115, 22); // Orange primary
    doc.text(restaurantName.toUpperCase(), pageWidth / 2, currentY, { align: "center" });

    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(address, pageWidth / 2, currentY, { align: "center" });

    currentY += 4;
    doc.text(`Phone: ${phone}`, pageWidth / 2, currentY, { align: "center" });

    // Divider Line
    currentY += 3;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(10, currentY, pageWidth - 10, currentY);

    // 2. Receipt Subtitle & Status Badge
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text("TAX INVOICE / RECEIPT", 10, currentY);

    doc.setFontSize(8.5);
    if (isPaid) {
        doc.setTextColor(16, 149, 74); // Green
        doc.text("[ PAID ]", pageWidth - 10, currentY, { align: "right" });
    } else {
        doc.setTextColor(234, 88, 12); // Orange
        doc.text("[ PAYMENT PENDING ]", pageWidth - 10, currentY, { align: "right" });
    }

    // 3. Invoice & Customer Meta Grid
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);

    doc.text(`Order #: ${orderNumber}`, 10, currentY);
    doc.text(`Date: ${orderDate} ${orderTime}`, pageWidth - 10, currentY, { align: "right" });

    currentY += 4;
    doc.text(`Customer: ${customerName} (${members} guests)`, 10, currentY);
    doc.text(`Table: ${tableNo}`, pageWidth - 10, currentY, { align: "right" });

    currentY += 4;
    doc.text(`Phone: ${customerPhone}`, 10, currentY);
    doc.text(`Served By: ${waiterName}`, pageWidth - 10, currentY, { align: "right" });

    currentY += 4;

    // 4. Itemized Table
    const tableItems = (order.items || []).map((item, index) => [
        String(index + 1),
        item.name || "Menu Item",
        String(item.quantity || 1),
        formatPdfCurrency(item.unitPrice),
        formatPdfCurrency((item.quantity || 1) * (item.unitPrice || 0)),
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [["#", "Item Description", "Qty", "Price", "Amount"]],
        body: tableItems,
        margin: { left: 10, right: 10 },
        styles: {
            font: "helvetica",
            fontSize: 7.5,
            cellPadding: 2,
            textColor: [40, 40, 40],
            lineColor: [230, 230, 230],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [245, 245, 247],
            textColor: [30, 30, 30],
            fontStyle: "bold",
            halign: "left",
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 8 },
            1: { halign: "left" },
            2: { halign: "center", cellWidth: 12 },
            3: { halign: "right", cellWidth: 24 },
            4: { halign: "right", cellWidth: 26 },
        },
        theme: "plain",
    });

    const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 4 : currentY + 30;

    // 5. Totals & Payment Summary Box
    const totalsX = pageWidth - 65;
    let totalsY = finalY;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    // Subtotal
    doc.text("Subtotal:", totalsX, totalsY);
    doc.text(formatPdfCurrency(subtotal), pageWidth - 10, totalsY, { align: "right" });

    // Tax
    totalsY += 4;
    doc.text("Tax / GST:", totalsX, totalsY);
    doc.text(formatPdfCurrency(tax), pageWidth - 10, totalsY, { align: "right" });

    // Discount (if any)
    if (discount > 0) {
        totalsY += 4;
        doc.setTextColor(22, 163, 74);
        doc.text("Discount:", totalsX, totalsY);
        doc.text(`- ${formatPdfCurrency(discount)}`, pageWidth - 10, totalsY, { align: "right" });
        doc.setTextColor(80, 80, 80);
    }

    // Tip (if any)
    if (tip > 0) {
        totalsY += 4;
        doc.text("Tip:", totalsX, totalsY);
        doc.text(formatPdfCurrency(tip), pageWidth - 10, totalsY, { align: "right" });
    }

    // Final Total Border & Line
    totalsY += 3;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(totalsX, totalsY, pageWidth - 10, totalsY);

    totalsY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(249, 115, 22);
    doc.text("Grand Total:", totalsX, totalsY);
    doc.text(formatPdfCurrency(finalTotal), pageWidth - 10, totalsY, { align: "right" });

    // Payment Meta on the left side of totals
    let paymentMetaY = finalY;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    doc.text(`Payment Mode: ${paymentMethod}`, 10, paymentMetaY);
    if (order.paidAt) {
        const paidTimeStr = new Date(order.paidAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
        paymentMetaY += 4;
        doc.text(`Settled At: ${paidTimeStr}`, 10, paymentMetaY);
    }

    // 6. Footer Note
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(230, 230, 230);
    doc.line(10, footerY - 4, pageWidth - 10, footerY - 4);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text("Thank you for dining with us! Please visit again.", pageWidth / 2, footerY, {
        align: "center",
    });

    // Save and trigger browser download
    const fileName = `TableFlow-Bill-Order-#${orderNumber}.pdf`;
    doc.save(fileName);
};

