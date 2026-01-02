export default function DetailsAgenceHero() {
  return (
    <section
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/assets/herobg.png')" }}
    >
      {/* Overlay Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/overlaybg.png')" }}
      />

      {/* Optional semi-transparent gradient on top of overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-24 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-cal-sans font-bold text-white mb-4 ">
Partenaires      </h1>
        <p className="text-sm md:text-base text-white font-cal-sans uppercase">
          Accueil &gt; Partenaires &gt;ARCHITEX INTERNATIONAL
        </p>
      </div>
    </section>
  );
}