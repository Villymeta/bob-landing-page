"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function SuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bob_last_order");
      if (stored) {
        setOrder(JSON.parse(stored));
        localStorage.removeItem("bob_last_order"); // cleanup
      }
    } catch (err) {
      console.error("❌ Failed to load last order:", err);
    }
  }, []);

  if (!order) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No recent order found.</p>
      </section>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // 🟡 Generate Branded PDF Receipt
  const downloadReceipt = async () => {
    const doc = new jsPDF();

    // Load logo from /public
    const logoUrl = "/logo.png";
    const logo = await fetch(logoUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

    // Insert logo
    doc.addImage(logo, "PNG", 85, 10, 40, 20);

    // Brand colors
    const bobYellow = [255, 215, 0];
    const bobBlack = [0, 0, 0];

    // Header
    doc.setFontSize(20);
    doc.setTextColor(...bobBlack);
    doc.setFont("helvetica", "bold");
    doc.text("B.O.B SHOP", 105, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(...bobYellow);
    doc.text("Official Receipt", 105, 48, { align: "center" });

    doc.setDrawColor(...bobYellow);
    doc.line(20, 52, 190, 52);

    let y = 65;

    // Customer Info
    doc.setFontSize(14);
    doc.setTextColor(...bobBlack);
    doc.text("👤 Customer Information", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Name: ${order.customerName}`, 20, y);
    y += 6;
    doc.text(`Email: ${order.customerEmail}`, 20, y);
    y += 6;
    doc.text(`Wallet: ${order.customerWallet}`, 20, y);
    y += 12;

    // Transaction Info
    doc.setFontSize(14);
    doc.text("🔗 Transaction", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Reference: ${order.reference}`, 20, y);
    y += 6;

    if (order.signature) {
      doc.text(`Signature: ${order.signature}`, 20, y);
      y += 12;

      // 🟡 Generate QR code for Solana Explorer
      const explorerUrl = `https://explorer.solana.com/tx/${order.signature}?cluster=devnet`;
      const qrDataUrl = await QRCode.toDataURL(explorerUrl);
      doc.addImage(qrDataUrl, "PNG", 150, y - 10, 40, 40);
      y += 45;
    } else {
      y += 6;
    }

    // Order Summary
    doc.setFontSize(14);
    doc.text("🧾 Order Summary", 20, y);
    y += 8;

    doc.setFontSize(12);
    order.items.forEach((item) => {
      doc.text(
        `${item.qty}x ${item.name} ${
          item.size ? `| Size: ${item.size}` : ""
        } ${item.color ? `| Color: ${item.color}` : ""}`,
        20,
        y
      );
      doc.text(`$${(item.price * item.qty).toFixed(2)}`, 170, y, {
        align: "right",
      });
      y += 8;
    });

    // Total
    y += 5;
    doc.setDrawColor(...bobBlack);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", 20, y);
    doc.text(`$${subtotal.toFixed(2)}`, 170, y, { align: "right" });

    // Footer
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(
      "Thank you for shopping with B.O.B! Follow us @BeaniesOnBusiness",
      105,
      y,
      { align: "center" }
    );

    // Save PDF
    doc.save(`receipt-${order.reference}.pdf`);
  };

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-green-600 text-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">✅ Payment Confirmed!</h1>
        <p className="text-lg mb-6">
          Thank you, <span className="font-semibold">{order.customerName}</span>!
          Your order has been processed successfully.
        </p>

        {/* Order Summary */}
        <div className="bg-white text-black rounded-xl shadow-md p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4">🧾 Order Summary</h2>
          {order.items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.qty} × ${item.price}{" "}
                  {item.size && `| Size: ${item.size}`}{" "}
                  {item.color && `| Color: ${item.color}`}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-black text-white rounded-lg p-4 mb-6 text-sm text-left">
          <p>
            <span className="font-semibold">Reference:</span> {order.reference}
          </p>
          {order.signature && (
            <p>
              <span className="font-semibold">Signature:</span>{" "}
              <a
                href={`https://explorer.solana.com/tx/${order.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 underline"
              >
                View on Solana Explorer
              </a>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
          >
            Continue Shopping
          </Link>
          <button
            onClick={downloadReceipt}
            className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            ⬇️ Download Receipt
          </button>
        </div>
      </div>
    </section>
  );
}