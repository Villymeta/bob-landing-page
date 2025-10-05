"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useBag } from "@/context/BagContext";

const MERCHANT_WALLET = "Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ";

export default function CheckoutPage() {
  const router = useRouter();
  const autocompleteRef = useRef(null);
  const { bag, subtotal, clearBag } = useBag();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    deliveryMethod: "pickup",
  });

  const [loading, setLoading] = useState(false);
  const shippingFee = formData.deliveryMethod === "ship" ? 10 : 0;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Google Maps Autocomplete
  useEffect(() => {
    if (formData.deliveryMethod !== "ship") return;

    const input = autocompleteRef.current;
    if (!input || !(input instanceof HTMLInputElement)) return;
    if (!window.google?.maps?.places) return;

    const ac = new window.google.maps.places.Autocomplete(input, {
      fields: ["address_components", "formatted_address"],
    });

    const listener = ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place?.address_components) return;

      let streetVal = "",
        cityVal = "",
        stateVal = "",
        zipVal = "",
        countryVal = "";

      place.address_components.forEach((comp) => {
        const types = comp.types;
        if (types.includes("street_number")) streetVal = comp.long_name + " " + streetVal;
        if (types.includes("route")) streetVal += comp.long_name;
        if (types.includes("locality")) cityVal = comp.long_name;
        if (types.includes("administrative_area_level_1")) stateVal = comp.short_name;
        if (types.includes("postal_code")) zipVal = comp.long_name;
        if (types.includes("country")) countryVal = comp.long_name;
      });

      setFormData((prev) => ({
        ...prev,
        address: streetVal,
        city: cityVal,
        state: stateVal,
        zip: zipVal,
        country: countryVal,
      }));
    });

    return () => listener.remove();
  }, [formData.deliveryMethod]);

  // ✅ Unified Checkout Handler (connects to /api/checkout)
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bag.length === 0) throw new Error("Your bag is empty.");

      const customer = {
        name: formData.name,
        email: formData.email,
        wallet: formData.walletAddress,
      };

      const items = bag.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: item.price,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Order submitted! Please send payment to the wallet below.");

        localStorage.setItem(
          "bob_last_order",
          JSON.stringify({
            reference: data.reference,
            customerName: formData.name,
            customerEmail: formData.email,
            customerWallet: formData.walletAddress,
            items: bag,
            total,
            deliveryMethod: formData.deliveryMethod,
          })
        );

        clearBag();
        router.push(`/checkout/success?ref=${data.reference}`);
      } else {
        throw new Error(data.error || "Order submission failed.");
      }
    } catch (err) {
      alert("❌ Error submitting order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="google-maps"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-black text-white flex flex-col items-center py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleCheckout} className="bg-[#f7e49b] p-6 rounded-lg w-full max-w-md text-black">
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded"
            required
          />
          <input
            name="walletAddress"
            placeholder="Your Wallet Address"
            value={formData.walletAddress}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded"
            required
          />

          <select
            name="deliveryMethod"
            value={formData.deliveryMethod}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded"
          >
            <option value="pickup">Pickup (DDLV)</option>
            <option value="ship">Ship (+$10)</option>
          </select>

          {formData.deliveryMethod === "ship" && (
            <>
              <input
                ref={autocompleteRef}
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full mb-3 p-2 rounded"
                required
              />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
              <input name="zip" placeholder="ZIP Code" value={formData.zip} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
              <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full mb-3 p-2 rounded" required />
            </>
          )}

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Order Summary:</h3>
            {bag.map((item, i) => (
              <p key={i}>
                {item.qty} × {item.name} ({item.size}) — ${item.price}
              </p>
            ))}
            {shippingFee > 0 && <p>Shipping: ${shippingFee}</p>}
            <p className="font-bold mt-2">Total: ${total.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-800 mb-2">Send payment manually to:</p>
            <div className="bg-black text-[#f7e49b] text-center p-2 rounded font-mono break-all">
              {MERCHANT_WALLET}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-black text-[#f7e49b] font-bold py-2 rounded hover:bg-gray-900 transition disabled:bg-gray-700"
          >
            {loading ? "Processing…" : "Submit Order"}
          </button>
        </form>
      </div>
    </>
  );
}
