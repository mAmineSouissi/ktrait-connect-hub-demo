import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: 'Architectes et Cabinets dArchitecture',
      description: 'Fournir des services de conception architecturale. Proposer des plans personnalisés et accompagner les clients dans la réalisation de leurs projets. Participer à la validation technique des projets soumis via la plateforme.',
    },
    {
      title: 'Bureaux dÉtudes Techniques (BET)',
      description: 'Réaliser des études de faisabilité et des diagnostics techniques (structure, thermique, environnemental). Valider les normes et réglementations liées aux projets de construction. Collaborer avec les architectes pour des dossiers complets (ex. permis de construire).',
    },
    {
      title: 'Ingénieurs (Construction, Génie Civil, Urbanisme)',
      description: 'Fournir une expertise technique pointue dans les domaines du calcul de structures, de la mécanique des sols ou de l efficacité énergétique. Conseiller les clients sur les solutions les plus adaptées pour leurs projets. Superviser ou valider des étapes de construction selon les normes en vigueur.',
    },
    {
      title: 'Entreprises',
      description: 'Exécuter les travaux selon les plans et normes. Gérer le chantier, les équipes et les matériaux. Contrôler la qualité et la sécurité des ouvrages. Coordonner avec ingénieurs, architectes et fournisseurs. Livrer le projet conforme aux délais et cahier des charges.',
    },
  ];

  return (
    <section className="py-8 md:py-16 lg:py-24 bg-white overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-16">
        {/* Section Header with Background */}
        <div
          className="services-bg-image relative bg-contain bg-no-repeat bg-right px-0 md:px-8 lg:px-12 py-8 md:py-12 lg:py-20"
          style={{ 
            backgroundImage: "url('/assets/house.png')",
            backgroundPosition: 'right center',
            backgroundSize: 'auto 90%'
          }}
        >
          {/* Section Intro */}
          <div className="mb-8 md:mb-12 lg:mb-16 max-w-7xl mx-auto">
            <div className="flex items-center mb-4 md:mb-6">
              {/* Small green circle */}
            <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
    QUI NOUS SOMMES
  </span>
</div>

            </div>

<div className="relative max-w-full lg:max-w-4xl 
                lg:relative lg:translate-x-[300px] lg:-translate-y-[50px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold text-black leading-tight mb-4 md:mb-6">
    Une Solution Digitale Complète <br />
    <span className="text-[#006D64]">Pour Réussir Vos Projets.</span>
  </h2>

  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-golos max-w-full lg:max-w-3xl font-medium leading-relaxed">
    Notre plateforme vous accompagne depuis l&apos;idée jusqu&apos;à la réalisation : budgétisation, étude de rentabilité, définition de la vocation, coordination, suivi de l&apos;avancement et centralisation des documents. Une gestion simplifiée, précise et accessible à tous.
  </p>
</div>

          </div>

          {/* Services Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
  {services.map((service, index) => (
    <div
      key={index}
      className="service-card bg-white rounded-2xl md:rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
    >
      {/* Title */}
      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-cal-sans font-bold text-black mb-4 leading-tight min-h-[60px]">
        {service.title}
      </h3>

      {/* CTA Button */}
      <Link
        href="/"
        className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-[#006D64] text-white font-cal-sans text-xs lg:text-sm hover:bg-[#00514d] transition-all duration-300 group mb-4 w-fit"
      >
        <span className="whitespace-nowrap">Découvrir Plus</span>
        <span className="w-5 h-5 flex items-center justify-center bg-white rounded-full flex-shrink-0">
          <svg 
            className="w-3 h-3 text-[#006D64] transform -rotate-45" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </span>
      </Link>

      {/* Gray line separator */}
      <div className="w-full h-px bg-gray-300 mb-4"></div>

      {/* Description with bullet points */}
      <div className="flex flex-col gap-3 flex-grow">
        {service.description.split('. ').map((line, idx) => (
          line.trim() && (
            <div key={idx} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full flex-shrink-0"></span>
              <p className="text-sm text-gray-600 font-golos leading-relaxed">
                {line.trim()}{line.trim().endsWith('.') ? '' : '.'}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  ))}
</div>

        </div>
      </div>
    </section>
  );
}