'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { useWallet } from '@solana/wallet-adapter-react';

// Load WalletMultiButton dynamically
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <header className="bg-bobyellow text-black shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo Left */}
        <Link href="/">
          <img src="/logo.png" alt="BOB Logo" className="h-6 sm:h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium text-sm">
          <Link href="/"><span className="hover:text-gray-800 transition">Home</span></Link>
          <Link href="/about"><span className="hover:text-gray-800 transition">About</span></Link>
          <Link href="/members"><span className="hover:text-gray-800 transition">Members</span></Link>
          <Link href="/shop"><span className="hover:text-gray-800 transition">Shop</span></Link>
        </nav>

        {/* Wallet + Hamburger Right */}
        <div className="flex items-center space-x-4">
          {isMounted && (
            <div className="hidden md:block">
              <WalletMultiButton className="!bg-gradient-to-r !from-orange-400 !to-pink-500 !text-white !rounded-full !px-4 !py-2 !font-bold" />
            </div>
          )}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <HiOutlineMenuAlt3 size={24} />
          </button>
        </div>
      </div>

      {/* Overlay & Slide-In Menu */}
      {menuOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Slide-in menu with transparent bobyellow + blur */}
          <div className="fixed inset-y-0 right-0 w-72 bg-bobyellow/80 backdrop-blur-md z-50 shadow-lg transform transition-transform duration-300 translate-x-0">
            <div className="flex justify-between items-center p-6">
              <img src="/logo.png" alt="BOB Logo" className="h-12 sm:h-12 w-auto" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <HiOutlineX size={28} />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 text-lg font-medium px-6">
              <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/members" onClick={() => setMenuOpen(false)}>Members</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
            </nav>

            {/* Wallet Button in mobile menu */}
            {isMounted && (
              <div className="mt-6 px-6">
                <WalletMultiButton className="!bg-gradient-to-r !from-orange-400 !to-pink-500 !text-white !rounded-full !w-full !py-2 !font-bold" />
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}