'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PFPCard from "../../components/pfpcard";
import members from "../data/members";
import MemberModal from "../../components/MemberModal";

export default function MembersPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(null);

  const closeModal = () => setSelectedIndex(null);

  const prevMember = () => {
    setDirection(-1);
    setSelectedIndex((i) => (i > 0 ? i - 1 : members.length - 1));
  };

  const nextMember = () => {
    setDirection(1);
    setSelectedIndex((i) => (i < members.length - 1 ? i + 1 : 0));
  };

  // ✅ Keyboard controls
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevMember();
      if (e.key === "ArrowRight") nextMember();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  // ✅ Swipe controls
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? nextMember() : prevMember();
    }
    touchStartX.current = null;
  };

  return (
    <main className="min-h-screen relative bg-black text-white px-4 py-8 text-center">
      {/* Title + Logo Section */}
      <div className="relative flex flex-col items-center justify-center text-center mb-12">
        {/* Logo watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex justify-center items-center z-0"
        >
          <Image
            src="/BOBgold.png"
            alt="BOB Logo"
            width={500}
            height={500}
            className="w-2/3 sm:w-1/2 md:w-1/3 h-auto object-contain"
          />
        </motion.div>

        {/* Text overlapping logo */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-extrabold 
                     bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 
                     bg-clip-text text-transparent drop-shadow-[0_0_12px_#FFD54F]"
        >
          Beanies on Business
        </motion.h1>

        <p className="relative z-10 text-lg md:text-xl text-gray-300 mt-3">
          Meet the Beanie DAO
        </p>
        <p className="relative z-10 text-lg md:text-xl text-gray-400 mt-2 max-w-xl">
          Our founding members building the future together.
        </p>
      </div>

      {/* Member Grid */}
      <div
        className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-10 max-w-6xl mx-auto relative z-10 transition ${
          selectedIndex !== null ? "blur-sm scale-95 pointer-events-none" : ""
        }`}
      >
        {members.map((bean, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => setSelectedIndex(idx)}
          >
            <PFPCard src={bean.src} alt={`${bean.name}'s PFP`} />
            <p className="mt-2 text-lg font-bold hover:underline">{bean.name}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <MemberModal
            member={members[selectedIndex]}
            onClose={closeModal}
            onNext={nextMember}
            onPrev={prevMember}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </AnimatePresence>
    </main>
  );
}