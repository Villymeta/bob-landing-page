'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function ShopPage() {
  const launchDate = new Date('2025-08-15T18:00:00Z'); // Change this to your target
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const distance = launchDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen bg-black text-bobyellow flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">
        B.O.B Drops
      </h1>
      <h2 className="text-2xl sm:text-2xl font-bold mb-4">
      Coming Soon
      </h2>

      {timeLeft.days >= 0 ? (
        <div className="text-2xl sm:text-4xl font-semibold mb-6 space-x-3">
          <span>{timeLeft.days}d</span>
          <span>{timeLeft.hours}h</span>
          <span>{timeLeft.minutes}m</span>
          <span>{timeLeft.seconds}s</span>
        </div>
      ) : (
        <p className="text-xl font-medium mb-6">Drop is live! Connect your wallet to shop.</p>
      )}

      <WalletMultiButton className="!bg-gradient-to-r !from-orange-400 !to-pink-500 !text-white !rounded-full !px-6 !py-3 !font-bold" />

      <p className="mt-8 text-base sm:text-lg max-w-md text-gray-300">
        Get ready for limited edition apparel. Pay with crypto using your Solana wallet. 
      </p>
    
    </section>
  );
}