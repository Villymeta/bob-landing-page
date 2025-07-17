'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-bobyellow text-black py-6 mt-12">
      {/* Top Tier: Icons + Centered "Follow us on X" */}
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
        {/* Icons Row */}
        <div className="flex items-center justify-between w-full px-8 max-w-md">
          {/* Left Icon */}
          <a
            href="https://www.doginaldogs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/DoginalIcon.gif"
              alt="Doginal Dogs"
              className="h-8 w-8 hover:scale-105 transition-transform duration-200"
            />
          </a>

          {/* Center X Icon */}
          <a
            href="https://x.com/BeanieDaoX"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/Xiconweb.png"
              alt="Follow on X"
              className="h-12 w-12 hover:scale-105 transition-transform duration-200"
            />
          </a>

          {/* Right Icon */}
          <a
            href="https://x.com/doginaldogsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/DoginalDogXicon.gif"
              alt="Doginal Dogs X"
              className="h-10 w-10 hover:scale-105 transition-transform duration-200"
            />
          </a>
        </div>

        {/* Text under icons */}
        <p className="text-sm font-semibold mt-2"> <span className="font-bold"></span></p>
      </div>

      {/* Bottom Tier: Copyright */}
      <div className="mt-6 text-center text-sm text-gray-800">
        © 2025 Beanies On Business. All rights reserved.
      </div>
    </footer>
  );
}