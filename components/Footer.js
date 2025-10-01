'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-bobyellow text-black py-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
        
        {/* Call to Action */}
        <p className="text-lg font-bold text-black">Join the Pack</p>

        {/* Footer Buttons */}
        <div className="flex space-x-4">
          <a
            href="https://doge-labs.com/collectible/doginal-dogs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full font-semibold text-black 
                       bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
                       hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-400
                       transition-transform transform hover:scale-105 shadow-md"
          >
            Doge Labs
          </a>
          <a
            href="https://doggy.market/nfts/doginaldogs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 rounded-full font-semibold text-black 
                       bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500
                       hover:from-yellow-200 hover:via-yellow-300 hover:to-yellow-400
                       transition-transform transform hover:scale-105 shadow-md"
          >
            Doggy Market
          </a>
        </div>

        {/* Icons Row - Dogs left, socials right */}
        <div className="flex justify-between items-center w-full px-8 max-w-4xl">
          {/* Left Side - Dogs */}
          <div className="flex space-x-4">
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

          {/* Right Side - X, Discord, Instagram */}
          <div className="flex space-x-4">
            {/* X Icon */}
            <a
              href="https://x.com/BeanieDaoX"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Xiconweb.png"
                alt="Follow on X"
                className="h-10 w-10 hover:scale-105 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 3px #FFD54F) drop-shadow(0 0 6px #FFEB3B)",
                }}
              />
            </a>

            {/* Discord */}
            <a
              href="https://discord.gg/8au8eZx6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Discord.png"
                alt="Join us on Discord"
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 3px #FFD54F) drop-shadow(0 0 6px #FFEB3B)",
                }}
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/beaniedaox/?igsh=aHp4eDhiMG8xemN5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/Instagram logo.png"
                alt="Follow on Instagram"
                className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                style={{
                  filter:
                    "drop-shadow(0 0 3px #FFD54F) drop-shadow(0 0 6px #FFEB3B)",
                }}
              />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-sm text-gray-800 leading-tight">
          <p>© 2025 Beanies On Business.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}