import Image from "next/image";

export default function CTA() {
  return (
    <section className="relative w-full h-[70vh] min-h-[420px] md:h-[80vh] overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/assets/cta.png"
        alt="CTA background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Play Button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center md:-translate-y-10">
        <button className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/30 backdrop-blur-md border border-white flex items-center justify-center hover:scale-105 transition">
          <div className="w-16 h-16 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-30 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start justify-end pb-10 md:pb-24 mt-20 md:mt-2">
        <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl text-white ml-4 md:ml-8">
          {/* Hide on mobile, show on md+ */}
          <h2 className="hidden md:block text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-cal-sans font-semibold leading-tight mb-4">
            Débloquez Votre Maison
            <br />
            De Rêve.
          </h2>

          <p className="hidden md:block text-sm sm:text-base md:text-lg text-white/90 max-w-xl md:max-w-2xl lg:max-w-3xl font-thin mt-2 md:-mt-16 ml-0 md:ml-96">
            Nous encourageons les clients à participer activement aux  
            discussions, à partager leurs idées, leurs préférences et leurs 
            commentaires.
          </p>
        </div>
      </div>
    </section>
  );
}
