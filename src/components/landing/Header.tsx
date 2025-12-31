'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import BurgerMenu from './BurgerMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Accueil" },
    { href: "/about", label: "À propos" },
    { href: "/services", label: "Services" },
    { href: "/realisations", label: "Réalisations" },
    { href: "/partenaires", label: "Partenaires" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-16 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
      <div className="flex-shrink-0 ml-0 lg:-ml-28">
  <Link
    href="/"
    className="text-white font-cal-sans text-xl md:text-2xl lg:text-2xl"
  >
    KTRAIT KONSTRACTION
  </Link>
</div>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-white hover:text-primary transition-colors ${
                pathname === link.href ? "border-b-2 border-primary pb-1" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contact & CTA */}
        <div className="hidden lg:flex items-center space-x-6 ml-auto -mr-24">
          <div className="text-white text-right">
            <p className="text-sm font-golos">Appelle-nous</p>
            <p className="text-base font-golos font-medium">+216 98 123 456</p>
          </div>
          <Link
            href="/devis"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-cal-sans transition-colors"
          >
            Consultations
          </Link>
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/50 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <BurgerMenu />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-black/90 backdrop-blur-lg rounded-2xl p-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white hover:text-primary transition-colors py-2 ${
                  pathname === link.href ? "border-b-2 border-primary pb-1" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/20">
              <p className="text-white text-sm font-golos text-center">Appelle-nous</p>
              <p className="text-white text-base font-golos font-medium text-center">+216 98 123 456</p>
            </div>
            <Link
              href="/devis"
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-cal-sans text-center transition-colors"
            >
              Consultations
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
