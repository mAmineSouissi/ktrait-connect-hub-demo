export default function AboutIntro() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-block px-6 py-2 border border-gray-300 rounded-full mb-6">
              <span className="text-xs md:text-sm font-cal-sans text-black">Débuté en 2007</span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-cal-sans text-black leading-tight mb-6">
              <span className="text-primary">Rigueur et respect</span> des délais pour{' '}
              <span className="text-primary">la réussite</span> de tous{' '}
              <span className="text-primary">vos projets.</span>
            </h2>
          </div>

          {/* Right Column - Large Number Display */}
          <div className="relative">
            <div className="flex items-center justify-center lg:justify-start">
              <span className="text-9xl md:text-[356px] font-cal-sans text-primary leading-none opacity-90">
                08
              </span>
            </div>
            <div className="mt-6">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-xl font-cal-sans text-black">années</span>
                <span className="text-xl font-cal-sans text-black">d&apos;expérience</span>
              </div>
              <p className="text-base md:text-lg text-gray-600 font-golos max-w-md">
                Considérez-nous comme vos experts en design ! Nous vous offrons des conseils 
                d&apos;experts pour faire rayonner votre projet grâce à sa créativité, son 
                efficacité et ses solutions pertinentes.
              </p>
              <button className="mt-6 flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 rounded-full text-black font-cal-sans text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
                <span>plus sur nous</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
            <svg className="w-24 h-24 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-gray-900/20 to-gray-900/5 border border-gray-300 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}