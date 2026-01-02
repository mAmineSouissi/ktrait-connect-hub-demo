'use client';

import { useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/50 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      </button>

      {/* Overlay */}
  <button
  aria-label="Close menu overlay"
  onClick={() => setIsOpen(false)}
  className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
/>


      {/* Side Menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[380px] bg-black z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">KTRAITSMART</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Menu Content */}
<div className="flex flex-col h-full px-6 py-8 text-white overflow-y-auto">
  <p className="font-cal-sans font-bold">Nous façonnons des designs d&apos;intérieur, créant des espaces intemporels et inspirants</p>

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-3 mt-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative w-full h-20 rounded-lg overflow-hidden">
                <Image
                  src={`/assets/burgermenu/testimonial-${i}.jpg`}
                  alt={`Preview ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 text-sm text-gray-300 space-y-1">
            <p>17, Rue des Oliviers, Ben Arous</p>
            <p className="text-teal-400 font-medium">+216 98 123 456</p>
            <p className="font-cal-sans font-bold text-lg">info@ktraitengineering.com</p>
          </div>

          {/* Social Icons */}
    {/* Social Icons */}
<div className="mt-10 flex gap-5 justify-start">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="text-white hover:text-teal-400 transition-colors"
  >
    <FaFacebookF size={18} />
  </a>

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="text-white hover:text-teal-400 transition-colors"
  >
    <FaInstagram size={18} />
  </a>

  <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube"
    className="text-white hover:text-teal-400 transition-colors"
  >
    <FaYoutube size={18} />
  </a>

  <a
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="text-white hover:text-teal-400 transition-colors"
  >
    <FaLinkedinIn size={18} />
  </a>
</div>

        </div>
      </aside>
    </div>
  );
};

export default BurgerMenu;
