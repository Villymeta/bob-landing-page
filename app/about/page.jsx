'use client';

import React from 'react';

export default function About() {
  return (
    <div className="bg-black text-[#f8e49f] min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          About B.O.B
        </h1>

        <p className="text-lg leading-relaxed">
          <strong>Beanies on Business</strong> is more than just a community, 
          it’s a movement. We're a group of builders, creators, 
          and dreamers shaping the future of decentralized commerce and Web3 collaboration.
        </p>

        <p className="text-lg leading-relaxed">
          Our mission is to empower entrepreneurs through community ownership, 
          access to tools, creative freedom, and decentralized support networks. 
          We believe that collaboration beats competition, and that innovation starts with inclusion.
        </p>

        <div className="border-l-4 border-[#f8e49f] pl-4 italic text-md">
        " If you want to go fast, go alone. But if you want to go FAR… GO TOGETHER "
        </div>

        <p className="text-lg leading-relaxed">
          From merch drops and creator spotlights to education and community grants, Beanies On Business is redefining what a DAO can be.
        </p>
      </div>
    </div>
  );
}