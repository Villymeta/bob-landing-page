"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* 🔥 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
      >
        <source src="/DoginalAd.mp4" type="video/mp4" />
      </video>

      {/* Overlay (for readability) */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-4xl flex flex-col items-center space-y-6 text-center px-6 py-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Image
            src="/logo.png"
            alt="BOB Logo"
            width={110}
            height={110}
            className="mx-auto drop-shadow-lg"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed"
        >
          A community of <span className="text-bobyellow font-semibold">builders</span>, 
          <span className="text-bobyellow font-semibold"> creators</span>, and 
          <span className="text-bobyellow font-semibold"> innovators. </span> 
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-10 pt-8"
        >
          <Link href="/about">
            <span className="px-8 py-4 rounded-xl font-bold text-white 
                             bg-gradient-to-r from-black via-gray-800 to-gray-600
                             hover:from-gray-900 hover:via-gray-700 hover:to-gray-500
                             transition-transform transform hover:scale-105 shadow-xl">
              Learn More
            </span>
          </Link>
          <Link href="/members">
            <span className="px-8 py-4 rounded-xl font-bold text-white 
                             bg-gradient-to-r from-black via-gray-800 to-gray-600
                             hover:from-gray-900 hover:via-gray-700 hover:to-gray-500
                             transition-transform transform hover:scale-105 shadow-xl">
              Meet the Members
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ✅ Stats Strip */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } }
        }}
        className="relative z-10 mt-12 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 
                   bg-gray-900/70 backdrop-blur-md py-6 px-4 rounded-xl shadow-lg"
      >
        {[
          { number: "20", label: "Founding Members" },
          { number: "250+", label: "Community Members" },
          { number: "1", label: "DAO Vision" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.2, duration: 0.6 }}
              className="text-3xl font-bold text-bobyellow"
            >
              {stat.number}
            </motion.p>
            <p className="text-gray-300 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* 🤝 In Partnership Section */}
      <section className="relative z-10 w-full mt-16 bg-black/70 py-16 px-6 rounded-xl shadow-inner">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-bobyellow mb-4 tracking-wide">
          In Partnership
        </h2>
        <p className="text-center text-gray-400 max-w-xl mx-auto mb-12">
          We’re proud to build alongside our ecosystem partners.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        {/* CryptoSpaces */}
<motion.a
  href="https://cryptospaces.net/"
  target="_blank"
  rel="noopener noreferrer"
  whileHover={{ scale: 1.05 }}
  className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg"
>
  <Image
    src="/Cryptospaces.gif"
    alt="CryptoSpaces Network"
    width={400}
    height={200}
    className="mx-auto max-h-32 sm:max-h-40 object-contain"
    unoptimized
  />
</motion.a>

          {/* Yellow DAO */}
          <motion.a
            href="https://yellowdao.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-lg"
          >
            <Image
              src="/YellowDao.png"
              alt="Doginal Dogs YellowDAO"
              width={400}
              height={200}
              className="mx-auto max-h-32 sm:max-h-40 object-contain"
            />
          </motion.a>
        </div>
      </section>
    </main>
  );
}
