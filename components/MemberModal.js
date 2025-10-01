'use client';

import {
  FaInstagram,
  FaGlobe,
  FaReddit,
  FaMedium,
} from 'react-icons/fa';
import { HiOutlineX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaXTwitter } from 'react-icons/fa6'; // Correct X icon
import { SiQuora } from 'react-icons/si'; // Quora icon
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { FaFacebook } from 'react-icons/fa';

export default function MemberModal({ member, onClose, onNext, onPrev }) {
  if (!member) return null;

  const socials = [
    { icon: <FaXTwitter />, url: member.socials?.x },
    { icon: <FaInstagram />, url: member.socials?.instagram },
    { icon: <FaGlobe />, url: member.socials?.website },
    { icon: <FaReddit />, url: member.socials?.reddit },
    { icon: <FaMedium />, url: member.socials?.medium },
    { icon: <SiQuora />, url: member.socials?.quora },
    { icon: <FaFacebook />, url: member.socials?.facebook },
  ];

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end md:items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative 
              bg-bobyellow bg-opacity-95 text-black shadow-xl 
              w-full max-w-md md:max-w-2xl 
              p-6 sm:p-8 
              rounded-t-2xl md:rounded-2xl
              h-[500px] md:h-[550px]   /* fixed modal height */
              overflow-y-auto
            "
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-black"
              onClick={onClose}
            >
              <HiOutlineX size={24} />
            </button>

            {/* Profile Image */}
            <img
              src={member.src}
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white"
            />

            {/* Name */}
            <h2 className="text-2xl font-bold text-center mt-4">
              {member.name}
            </h2>

            {/* Bio */}
            {member.bio && (
              <p className="text-gray-800 text-center mt-3 text-sm sm:text-base">
                {member.bio}
              </p>
            )}

            {/* Socials */}
            <div className="flex justify-center space-x-6 mt-5">
              {socials.map((s, i) =>
                s.url ? (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl hover:text-black transition"
                  >
                    {s.icon}
                  </a>
                ) : (
                  <span
                    key={i}
                    className="text-xl text-gray-400 cursor-not-allowed"
                  >
                    {s.icon}
                  </span>
                )
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={onPrev}
                className="flex items-center space-x-1 text-gray-700 hover:text-black"
              >
                <HiChevronLeft size={24} /> <span>Prev</span>
              </button>
              <button
                onClick={onNext}
                className="flex items-center space-x-1 text-gray-700 hover:text-black"
              >
                <span>Next</span> <HiChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
