'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/herobg.png')" }}
    >
      {/* Overlay image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/overlaybg.png')" }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-32 md:py-40">
        <div className="max-w-4xl">
          <h1 className="font-cal-sans text-white leading-tight mb-6 md:mb-8">
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl opacity-90">
              Plateforme Intelligente
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              De Supervision Des Chantiers.
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-white font-golos mb-8 md:mb-12 max-w-xl">
            Analyse du budget, rentabilité, vocation, documents, suivi
            d’avancement… Tout ce qu’il vous faut pour prendre les bonnes
            décisions, au bon moment.
          </p>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-3">
  {/* Nom complet */}
  <input
    type="text"
    placeholder="Nom complet"
    className="w-full lg:w-56 xl:w-64 px-5 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 font-golos text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
  />

  {/* Téléphone */}
  <input
    type="tel"
    placeholder="Téléphone"
    className="w-full lg:w-56 xl:w-64 px-5 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 font-golos text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
  />

  {/* Code postal */}
  <input
    type="text"
    placeholder="Code postal"
    className="w-full lg:w-48 px-5 py-4 rounded-full bg-white text-gray-800 placeholder-gray-500 font-golos text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary"
  />

  {/* CTA Button */}
  <Link
    href="/conseil"
    className="inline-flex items-center justify-center space-x-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-transparent text-white font-cal-sans text-sm md:text-base hover:bg-primary-dark transition-all duration-300 group whitespace-nowrap"
  >
    <span>Découvrir Ktrait Konstruction</span>
   <span className="w-10 h-10 flex items-center justify-center bg-[#006D64] rounded-full relative -translate-y-[10%]">
 <span className="w-10 h-10 flex items-center justify-center bg-[#006D64] rounded-full relative -translate-y-[10%]">
<Image
  src="/assets/arrow.png"
  alt="Up arrow"
  width={12}
  height={12}
  className="w-2 h-2 md:w-3 md:h-3"
/>

</span>
</span>

  </Link>
</div>

        </div>
      </div>

      {/* Decorative blurred shapes */}
      <div className="absolute bottom-20 right-20 w-32 h-32 md:w-48 md:h-48 bg-primary/30 rounded-full blur-3xl hidden md:block" />
      <div className="absolute top-1/4 left-10 w-24 h-24 md:w-40 md:h-40 bg-white/10 rounded-full blur-2xl hidden md:block" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block z-10">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
