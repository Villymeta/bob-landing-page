'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20 text-center">
      {/* Hero Section */}
      <div className="max-w-4xl flex flex-col items-center space-y-6">
        <Image
          src="/logo.png"
          alt="BOB Logo"
          width={100}
          height={100}
          className="mx-auto"
        />

        <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
          A community of builders, creators, and dreamers in Web3.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link href="/about">
            <span className="bg-bobyellow text-black px-6 py-3 font-semibold rounded hover:bg-bobyellow/90 transition">
              Learn More
            </span>
          </Link>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
        </p>

          <Link href="/members">
            <span className="border-2 border-white text-white px-6 py-3 font-semibold rounded hover:bg-white hover:text-black transition">
              Meet the Members
            </span>
          </Link>
        </div>

        {/* 🔥 Video Ad */}
        <div className="w-full max-w-3xl aspect-video mt-8 rounded-lg overflow-hidden shadow-lg bg-black">
          <video
            className="w-full h-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/DoginalAd.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  );
}