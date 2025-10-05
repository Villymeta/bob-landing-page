"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // ✅ Load from localStorage on init
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("bob_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ✅ Persist changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem("bob_cart", JSON.stringify(cart));
    } catch {
      console.error("Failed to persist cart");
    }
  }, [cart]);

  // ➕ Add item (unique by id + size + color)
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, qty: i.qty + (item.qty || 1) }
            : i
        );
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  // ❌ Remove specific item
  const removeFromCart = (id, size, color) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.id === id && i.size === size && i.color === color)
      )
    );
  };

  // 🔄 Update quantity
  const updateQty = (id, size, color, qty) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color ? { ...i, qty } : i
      )
    );
  };

  // 🗑️ Clear cart
  const clearCart = () => setCart([]);

  // 🧮 Derived values (memoized)
  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      count: cart.reduce((n, i) => n + i.qty, 0), // total items
      subtotal: cart.reduce((sum, i) => sum + i.price * i.qty, 0), // subtotal $
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}