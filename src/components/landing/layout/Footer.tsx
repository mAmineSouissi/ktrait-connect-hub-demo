import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden font-golos">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/footerr.jpg"
          alt="Footer background"
          fill
          className="object-cover opacity-40"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Large Brand Text Overlay */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none">
        <div className="text-[100px] sm:text-[180px] md:text-[230px] lg:text-[340px] xl:text-[387px] font-bold leading-none text-white/5 translate-y-[35%] whitespace-nowrap select-none">
          ktrait
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-16 sm:py-20 md:py-28 lg:py-32">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Column 1: About */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4 tracking-tight">
              KTRAITSMART
            </h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed">
              Nous transformons votre vision en espaces magnifiquement conçus.
            </p>
            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed pt-2">
              17, Rue des Oliviers, Ben Arous.<br />
              Code postal : 2074.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
              <li>
                <Link href="/about" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/carrières" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="/equipe" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Notre équipe
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: More Links */}
          <div>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
              <li>
                <Link href="/projets" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Nos projets
                </Link>
              </li>
              <li>
                <Link href="/partenaires" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Partenaires
                </Link>
              </li>
              <li>
                <Link href="/programme-partenaires" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Programme Partenaires
                </Link>
              </li>
              <li>
                <Link href="/affiliation" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Programme d&apos;affiliation
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-white/90 hover:text-primary transition-colors duration-300 inline-block">
                  Centre d&apos;assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3 sm:space-y-4">
            <a href="tel:+21698123456" className="block text-xl sm:text-2xl md:text-3xl font-semibold text-primary hover:text-teal-700 transition-colors duration-300">
              +216 98 123 456
            </a>
            <a href="mailto:info@ktraitengineering.com" className="block text-base sm:text-xl md:text-xl lg:text-xl font-medium text-white/95 hover:text-primary transition-colors duration-300 break-words">
              info@ktraitengineering.com
            </a>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg pt-2 md:pt-4">
              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary transition-colors duration-300"
              >
                Facebook
              </a>
              <span className="text-white/40">-</span>
              <a
                href="https://www.instagram.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary transition-colors duration-300"
              >
                Instagram
              </a>
              <span className="text-white/40">-</span>
              <a
                href="https://www.youtube.com/yourchannel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-primary transition-colors duration-300"
              >
                YouTube
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 md:pt-10">
          <p className="text-center text-xs sm:text-sm md:text-base text-white/70">
            © Copyright 2025 <span className="font-semibold text-primary">KTRAITENGINEERING</span>. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
