"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWallet, setCustomerWallet] = useState("");

  // Shipping info
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // Payment state
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [reference, setReference] = useState(null);
  const [signature, setSignature] = useState(null);

  const autocompleteRef = useRef(null);

  // 💳 subtotal
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // 🗺️ Google Places Autocomplete init
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ["address"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      let streetVal = "";
      let cityVal = "";
      let stateVal = "";
      let zipVal = "";
      let countryVal = "";

      place.address_components.forEach((comp) => {
        const types = comp.types;
        if (types.includes("street_number")) streetVal = comp.long_name + " " + streetVal;
        if (types.includes("route")) streetVal += comp.long_name;
        if (types.includes("locality")) cityVal = comp.long_name;
        if (types.includes("administrative_area_level_1")) stateVal = comp.short_name;
        if (types.includes("postal_code")) zipVal = comp.long_name;
        if (types.includes("country")) countryVal = comp.long_name;
      });

      setStreet(streetVal);
      setCity(cityVal);
      setState(stateVal);
      setZip(zipVal);
      setCountry(countryVal);
    });
  }, []);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!customerName || !customerEmail || !customerWallet || !street || !city || !state || !zip || !country) {
        throw new Error("Please fill out all customer & shipping details before checkout.");
      }

      // 1️⃣ Create Solana Pay session
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: "BOB Order",
          priceUsd: subtotal,
          items: cart,
          customer: {
            name: customerName,
            email: customerEmail,
            wallet: customerWallet,
            address: { street, city, state, zip, country },
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url || !data.reference) {
        throw new Error(data.error || "Failed to create payment");
      }

      setPaymentUrl(data.url);
      setReference(data.reference);

      // 2️⃣ Start polling verify-payment
      const interval = setInterval(async () => {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: data.reference }),
          });

          const verify = await verifyRes.json();

          if (verify.ok) {
            clearInterval(interval);
            setSignature(verify.signature);

            // 3️⃣ Update Google Sheets (send shipping too)
            await fetch("/api/update-stock", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: cart,
                reference: data.reference,
                signature: verify.signature || "N/A",
                customer: {
                  name: customerName,
                  email: customerEmail,
                  wallet: customerWallet,
                  address: { street, city, state, zip, country },
                },
              }),
            });

            // 4️⃣ Save last order
            localStorage.setItem(
              "bob_last_order",
              JSON.stringify({
                items: cart,
                customerName,
                customerEmail,
                customerWallet,
                reference: data.reference,
                signature: verify.signature,
                address: { street, city, state, zip, country },
              })
            );

            // 5️⃣ Clear cart & redirect
            clearCart();
            router.push("/checkout/success");
          }
        } catch {
          console.log("⏳ Waiting for payment...");
        }
      }, 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // UI
  // ------------------------

  if (paymentUrl) {
    return (
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Scan to Pay</h1>
        <div className="bg-white p-4 rounded-xl mb-6">
          <QRCode value={paymentUrl} size={220} />
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Reference: <span className="break-all">{reference}</span>
        </p>
        {!signature ? (
          <p className="text-yellow-400">⏳ Waiting for payment confirmation…</p>
        ) : (
          <p className="text-green-400">✅ Payment confirmed!</p>
        )}
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg">
        {/* Customer Info */}
        <label className="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Your full name"
        />

        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="you@example.com"
        />

        <label className="block text-sm font-bold mb-2">Wallet Address</label>
        <input
          type="text"
          value={customerWallet}
          onChange={(e) => setCustomerWallet(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Your Solana wallet address"
        />

       {/* Shipping Info with Google Autocomplete */}
<label className="block text-sm font-bold mb-2">Street Address</label>
<input
  ref={autocompleteRef}
  type="text"
  value={street}
  onChange={(e) => setStreet(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg mb-4"
  placeholder="123 Main St"
/>

<label className="block text-sm font-bold mb-2">City</label>
<input
  type="text"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg mb-4"
/>

<label className="block text-sm font-bold mb-2">State</label>
<input
  type="text"
  value={state}
  onChange={(e) => setState(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg mb-4"
/>

<label className="block text-sm font-bold mb-2">ZIP Code</label>
<input
  type="text"
  value={zip}
  onChange={(e) => setZip(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg mb-4"
/>

<label className="block text-sm font-bold mb-2">Country</label>
<input
  type="text"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg mb-4"
/>
        {/* Cart Summary */}
        {cart.map((item, i) => (
          <div
            key={`${item.id}-${item.size}-${item.color}-${i}`}
            className="flex justify-between items-center mb-4"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.qty} × ${item.price}{" "}
                {item.size && `| Size: ${item.size}`}{" "}
                {item.color && `| Color: ${item.color}`}
              </p>
            </div>
            <p className="font-semibold">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        ))}

        <div className="flex justify-between items-center border-t pt-4 font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition disabled:bg-gray-400"
        >
          {loading ? "Processing…" : "Pay with Solana Pay"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">⚠️ {error}</p>}
      </div>
    </section>
  );
}