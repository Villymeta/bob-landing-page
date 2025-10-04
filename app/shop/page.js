"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import ShopLive from "./ShopLive"; // import your shop component

export default function Page() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [showShop, setShowShop] = useState(false); // NEW FLAG

  // ⏰ Countdown target date
  const targetDate = new Date("2025-10-04T11:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
        setShowShop(true); // ✅ when time is up, show ShopLive
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Show shop live if countdown finished
  if (showShop) {
    return <ShopLive />;
  }

  // ✅ Otherwise show countdown UI
  return (
    <section
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-center text-white bg-center bg-no-repeat md:bg-cover bg-contain"
      style={{ backgroundImage: "url('/Shopbackground.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Grand Opening Sign */}
        <Image
          src="/grandopeningsign.png"
          alt="Grand Opening Sign"
          width={600}
          height={200}
          className="mb-6"
          priority
        />

        {/* Countdown Timer */}
        <div className="flex space-x-6 sm:space-x-12 text-4xl sm:text-6xl font-extrabold text-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.9)]">
          <div className="flex flex-col items-center">
            <span>{timeLeft.days}</span>
            <span className="text-sm sm:text-base mt-1">DAYS</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.hours}</span>
            <span className="text-sm sm:text-base mt-1">HOURS</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.minutes}</span>
            <span className="text-sm sm:text-base mt-1">MINUTES</span>
          </div>
          <div className="flex flex-col items-center">
            <span>{timeLeft.seconds}</span>
            <span className="text-sm sm:text-base mt-1">SECONDS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
