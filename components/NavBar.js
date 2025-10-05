"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineShoppingCart,
} from "react-icons/hi2";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { cart, removeFromCart } = useCart();

  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => setIsMounted(true), []);

  return (
    <header className="bg-bobyellow text-black shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.png" alt="BOB Logo" className="h-6 sm:h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium text-sm">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/members">Members</Link>
          <Link href="/shop">Shop</Link>
        </nav>

        {/* Right side (Cart + Mobile menu) */}
        <div className="flex items-center space-x-4 relative">
          {/* Cart Button */}
          <button
            aria-label="View cart"
            className="relative p-2 rounded-full hover:bg-gray-200 transition"
            onClick={() => setMiniCartOpen((prev) => !prev)}
          >
            <HiOutlineShoppingCart size={22} />
            {isMounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mini Cart Dropdown (Desktop) */}
          {miniCartOpen && (
            <div className="hidden md:block absolute right-0 top-12 w-96 bg-white text-black shadow-lg rounded-lg p-4 z-50">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty 🛒</p>
              ) : (
                <>
                  <ul className="divide-y max-h-60 overflow-y-auto">
                    {cart.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center py-3"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.qty} × ${item.price}
                            </p>
                            {item.size && (
                              <p className="text-xs text-gray-400">
                                Size: {item.size}
                              </p>
                            )}
                            {item.color && (
                              <p className="text-xs text-gray-400">
                                Color: {item.color}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.id, item.size, item.color)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between mt-3 font-bold">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-4 flex justify-between space-x-3">
                    <Link
                      href="/cart"
                      className="w-1/2 bg-gray-200 text-black text-center py-2 rounded-lg font-semibold hover:bg-gray-300"
                      onClick={() => setMiniCartOpen(false)}
                    >
                      View Cart
                    </Link>
                    <Link
                      href={`/checkout?product=Cart&price=${subtotal}`}
                      className="w-1/2 bg-yellow-400 text-black text-center py-2 rounded-lg font-bold hover:bg-yellow-500"
                      onClick={() => setMiniCartOpen(false)}
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Mini Cart Drawer */}
      {miniCartOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-80 bg-white text-black shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setMiniCartOpen(false)}>
                <HiOutlineX size={24} />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty 🛒</p>
            ) : (
              <>
                <ul className="divide-y max-h-96 overflow-y-auto">
                  {cart.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.qty} × ${item.price}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removeFromCart(item.id, item.size, item.color)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between mt-3 font-bold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex flex-col space-y-3">
                  <Link
                    href="/cart"
                    className="bg-gray-200 text-black text-center py-2 rounded-lg font-semibold hover:bg-gray-300"
                    onClick={() => setMiniCartOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    href={`/checkout?product=Cart&price=${subtotal}`}
                    className="bg-yellow-400 text-black text-center py-2 rounded-lg font-bold hover:bg-yellow-500"
                    onClick={() => setMiniCartOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-bobyellow z-50 shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <img
                src="/transparent-w-logo.png"
                alt="BOB Logo"
                className="h-10 w-auto"
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 font-medium">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/members" onClick={() => setMenuOpen(false)}>
                Members
              </Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link href="/cart" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t text-center text-sm">
              Beanies on Business
            </div>
          </div>
        </>
      )}
    </header>
  );
}