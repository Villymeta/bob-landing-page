"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const addressRef = useRef(null);

  // 🧱 States
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWallet, setCustomerWallet] = useState(""); // ✅ Added this
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  // 🧮 Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const [total, setTotal] = useState(subtotal);
  useEffect(() => {
    setTotal(deliveryOption === "shipping" ? subtotal + 10 : subtotal);
  }, [deliveryOption, subtotal]);

  // ✅ Set mounted after first render
  useEffect(() => {
    setMounted(true);
  }, []);

// 🗺️ Google Places Autocomplete (Stable Fix)
const initAutocomplete = () => {
  if (typeof window === "undefined" || !window.google || !addressRef.current)
    return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    addressRef.current,
    {
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"],
      componentRestrictions: { country: ["us"] },
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.address_components) return;

    let streetVal = "",
      cityVal = "",
      stateVal = "",
      zipVal = "",
      countryVal = "";

    for (const comp of place.address_components) {
      const types = comp.types;
      if (types.includes("street_number"))
        streetVal = `${comp.long_name} ${streetVal}`;
      if (types.includes("route")) streetVal += comp.long_name;
      if (types.includes("locality")) cityVal = comp.long_name;
      if (types.includes("administrative_area_level_1"))
        stateVal = comp.short_name;
      if (types.includes("postal_code")) zipVal = comp.long_name;
      if (types.includes("country")) countryVal = comp.long_name;
    }

    setStreet(streetVal);
    setCity(cityVal);
    setState(stateVal);
    setZip(zipVal);
    setCountry(countryVal);
  });

  console.log("✅ Autocomplete ready");
};

  // 🧾 Submit Order
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!customerName || !customerEmail || !customerWallet)
        throw new Error("Please fill out all required fields.");

      if (
        deliveryOption === "shipping" &&
        (!street || !city || !state || !zip || !country)
      )
        throw new Error("Please complete your shipping address.");

      const orderPayload = {
        customer: {
          name: customerName,
          email: customerEmail,
          wallet: customerWallet, // ✅ Include wallet here
        },
        deliveryOption,
        address:
          deliveryOption === "shipping"
            ? { street, city, state, zip, country }
            : null,
        items: cart,
        subtotal,
        total,
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Order logging failed.");

      localStorage.setItem("bob_last_order", JSON.stringify(orderPayload));

      clearCart();
      router.push("/success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted)
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading checkout...</p>
      </section>
    );

  if (!cart.length)
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Your cart is empty.</p>
      </section>
    );

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-10">
  <Script
  id="google-maps-script"
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
  strategy="afterInteractive"
  onLoad={() => {
    console.log("✅ Google Maps script loaded");
    initAutocomplete();
  }}
  onError={() => console.error("❌ Failed to load Google Maps script")}
></Script>

      <h1 className="text-3xl font-bold mb-6 text-bobyellow">Checkout</h1>

      <form
        onSubmit={handleCheckout}
        className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg"
      >
        {/* CUSTOMER INFO */}
        <label className="block text-sm font-bold mb-2">Full Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg mb-4"
          placeholder="Jane Doe"
        />

        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg mb-4"
          placeholder="you@example.com"
        />

        {/* WALLET INFO */}
        <label className="block text-sm font-bold mb-2">Your Wallet Address</label>
        <input
          type="text"
          value={customerWallet}
          onChange={(e) => setCustomerWallet(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg mb-4"
          placeholder="Enter your Solana wallet address"
        />

        {/* PAYMENT INSTRUCTION */}
        <div className="bg-black text-white rounded-xl p-4 mb-6">
          <p className="font-semibold text-bobyellow mb-2">📤 Send Payment To:</p>
          <div className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2">
            <p className="text-sm break-all select-all">
              Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  "Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ"
                );
                alert("Wallet address copied to clipboard!");
              }}
              className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded hover:bg-yellow-500"
            >
              Copy
            </button>
          </div>
        </div>

        {/* DELIVERY OPTION */}
        <label className="block text-sm font-bold mb-2">Delivery Method</label>
        <select
          value={deliveryOption}
          onChange={(e) => setDeliveryOption(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mb-4"
        >
          <option value="pickup">Pickup at DD Las Vegas</option>
          <option value="shipping">Ship to Address (+$10)</option>
        </select>

        {deliveryOption === "shipping" && (
          <>
     <label className="block text-sm font-bold mb-2">Street Address</label>
<input
  ref={addressRef}
  id="street-address"
  type="text"
  value={street}
  onChange={(e) => setStreet(e.target.value)}
  placeholder="Start typing your address..."
  autoComplete="off"  // ✅ disable browser autofill to not override Google
  className="w-full border px-3 py-2 rounded-lg mb-4 z-50 relative"
  required
/>

            <label className="block text-sm font-bold mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
              required
            />

            <label className="block text-sm font-bold mb-2">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
              required
            />

            <label className="block text-sm font-bold mb-2">ZIP Code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
              required
            />

            <label className="block text-sm font-bold mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
              required
            />
          </>
        )}

        {/* CART SUMMARY */}
        <div className="border-t border-gray-300 pt-4 mt-4">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>
                {item.qty}× {item.name}{" "}
                {item.size && `(${item.size})`} {item.color && `| ${item.color}`}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between font-semibold border-t pt-3 mt-3 text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {deliveryOption === "shipping" && (
            <div className="flex justify-between text-gray-600 mt-1">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
          )}

          <div className="flex justify-between font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-bobyellow text-black font-bold py-3 rounded-xl hover:brightness-110 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </section>
  );
}