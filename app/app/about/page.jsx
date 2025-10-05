'use client';

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="relative bg-black text-white min-h-screen px-6 py-12 overflow-hidden">
      {/* Background Watermark */}
      <div
        className="absolute inset-0 flex justify-center z-0"
        style={{ opacity: 0.35 }}
      >
        <Image
          src="/BOB-dao.png"
          alt="BOB DAO Watermark"
          width={800}
          height={800}
          className="pointer-events-none select-none object-contain"
          style={{ transform: "translateY(-5%)" }} // move image up slightly
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center space-y-12 z-10">
        
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-extrabold 
                     text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                     leading-tight sm:leading-snug 
                     bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 
                     bg-clip-text text-transparent 
                     drop-shadow-[0_0_6px_#FFD54F] sm:drop-shadow-[0_0_12px_#FFD54F] 
                     max-w-[90%] mx-auto text-center"
        >
          Beanies on Business
        </motion.h1>

        {/* About Content */}
        <div className="space-y-10 text-center w-full">
        <section className="bg-white/10 p-6 shadow-lg backdrop-blur-sm">
  <h2 className="font-bangers text-3xl text-bobyellow mb-2">
    Who We Are
  </h2>
  <p className="leading-relaxed text-gray-200 text-lg">
    <strong>Beanies on Business</strong> is more than just a community,
    it’s a movement. We're a group of builders, creators, and dreamers
    shaping the future of decentralized commerce and Web3 collaboration.
  </p>
</section>

<section className="bg-white/10 p-6 shadow-lg backdrop-blur-sm">
  <h2 className="font-bangers text-3xl text-bobyellow mb-2">
    Our Mission
  </h2>
  <p className="leading-relaxed text-gray-200 text-lg">
    We empower entrepreneurs through community ownership, access to tools,
    creative freedom, and decentralized support networks. We believe that
    collaboration beats competition, and that innovation starts with inclusion.
  </p>
  <blockquote className="border-l-4 border-bobyellow pl-4 italic text-md mt-3">
    <span
      className="text-bobyellow"
      style={{
        filter:
          "drop-shadow(0 0 3px #FFD54F) drop-shadow(0 0 6px #FFEB3B)",
      }}
    >
      "If you want to go fast, go alone. But if you want to go FAR… GO TOGETHER"
    </span>
  </blockquote>
</section>

<section className="bg-white/10 p-6 shadow-lg backdrop-blur-sm">
  <h2 className="font-bangers text-3xl text-bobyellow mb-2">
    Our Vision
  </h2>
  <p className="leading-relaxed text-gray-200 text-lg">
    From merch drops and creator spotlights to education and community grants,
    <strong> Beanies On Business </strong> is redefining what a DAO can be.
  </p>
</section>
        </div>

        {/* Bottom Logo */}
        <div className="flex justify-center pt-8">
          <Image
            src="/Beaniesonbusiness.png"
            alt="BOB Logo"
            width={280}
            height={280}
            style={{
              filter:
                "drop-shadow(0 0 6px #FFD54F) drop-shadow(0 0 14px #FFD54F) drop-shadow(0 0 28px #FFEB3B)",
            }}
          />
        </div>
      </div>
    </div>
  );
}