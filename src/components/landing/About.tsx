import Image from "next/image";

export default function About() {
  const advantages = [
    {
      title: 'Une Analyse Complète, Gratuitement',
      description: 'Lancez votre projet, évaluez-le et obtenez des résultats détaillés, le tout sans aucun frais.',
    },
    {
      title: 'Une Vision Précise De La Rentabilité',
      description: 'Comprenez immédiatement si votre projet est rentable et dans quelle mesure.',
    },
    {
      title: 'Une Coordination Fluide Entre Les Intervenants',
      description: 'Toutes les informations, documents et mises à jour sont synchronisés pour éviter erreurs et retards.',
    },
    {
      title: 'Une Expérience Pensée Pour Les Professionnels',
      description: 'Une interface intuitive, conçue pour les ingénieurs, promoteurs, architectes et développeurs de projets.',
    },
    {
      title: 'Un Budget Clair Et Maîtrisé',
      description: 'Visualisez en un instant le coût réel de votre projet et anticipez chaque dépense.',
    },
    {
      title: 'Une Orientation Adaptée À Votre Objectif',
      description: 'Bâtiment, résidentiel, bureautique, commercial, industriel, rénovation... la plateforme vous aide à définir la meilleure vocation.',
    },
    {
      title: 'Un Espace De Gestion Centralisé',
      description: 'Plus besoin de chercher : vos documents, suivis et tableaux sont regroupés au même endroit.',
    },
  ];

  return (
    <section className="relative py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/bgaboutt.png')",
          filter: 'blur(3px)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
              {/* Green circle inside */}
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

              {/* Text */}
              <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-white tracking-wider uppercase">
                NOS AVANTAGES
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold leading-tight mb-6 md:mb-8">
              Pourquoi Notre <span className="text-[#006D64]">Plateforme Fait La Différence ?</span>
            </h2>

            {/* Advantages List */}
            <div className="space-y-4 md:space-y-6">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4">
                  {/* Checkmark Icon */}
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-[#006D64] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <div>
                    <h3 className="font-cal-sans font-bold text-base md:text-lg lg:text-xl mb-1 md:mb-2">
                      {advantage.title}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base text-gray-300 font-golos leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Floor Plan Image */}
          <div className="relative lg:sticky lg:top-24">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white">
              {/* Floor Plan Image */}
              <Image
                src="/assets/plan.png"
                alt="Traditional Style Floor Plan"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
              />

              {/* Optional: Add a subtle border/shadow overlay */}
              <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl md:rounded-3xl pointer-events-none"></div>
            </div>

            {/* Decorative Glow Effects */}
            <div className="absolute -top-8 -right-8 w-32 h-32 md:w-48 md:h-48 bg-[#006D64]/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 md:w-40 md:h-40 bg-[#006D64]/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
}