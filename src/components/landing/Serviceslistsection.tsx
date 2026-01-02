'use client';

import { useState } from 'react';

export default function ServicesListSection() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 1,
      number: '01',
      title: 'Pilotage De Projets Neufs',
      description: 'Gestion complète de vos projets de construction neuve, de la conception à la livraison.',
      isActive: true,
    },
    {
      id: 2,
      number: '02',
      title: 'Amélioration & Rénovation',
      description: 'Expertise en rénovation et amélioration de bâtiments existants.',
      isActive: false,
    },
    {
      id: 3,
      number: '03',
      title: 'Études De Faisabilité',
      description: 'Analyses complètes pour évaluer la viabilité de vos projets immobiliers.',
      isActive: false,
    },
    {
      id: 4,
      number: '04',
      title: 'Suivi De Chantier',
      description: 'Surveillance et coordination de toutes les phases de construction.',
      isActive: false,
    },
    {
      id: 5,
      number: '05',
      title: 'Gestion Budgétaire Et Suivi',
      description: 'Contrôle rigoureux des coûts et suivi financier de vos projets.',
      isActive: false,
    },
    {
      id: 6,
      number: '06',
      title: 'Optimisation Des Coûts',
      description: 'Solutions pour maximiser la rentabilité de vos investissements immobiliers.',
      isActive: false,
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
            NOS PRESTATIONS
  </span>
</div>

     <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-cal-sans font-bold text-black leading-tight mb-4
               lg:relative lg:translate-x-[300px] lg:-translate-y-[40px]">
  Explorez Notre Expertise<br />
  En Gestion De <span className="text-[#006D64]">Projets Immobiliers</span>
</h2>

    <p className="text-sm md:text-base text-gray-600 font-golos leading-relaxed lg:relative lg:translate-x-[300px] lg:-translate-y-[40px]">
  Nous sommes spécialisés dans la concrétisation de vos visions. Découvrez notre portefeuille de <br />projets réussis, livrés dans les délais et  avec une précision exemplaire.
</p>

    </div>  
      <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12 lg:gap-16">
  {/* Left Column - Image */}
  <div className="flex-shrink-0 w-full lg:w-1/2 relative">
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl mt-16">
      <img
        src="/assets/img2.png"
        alt="Services"
        className="w-full h-full object-contain"
      />
    </div>

    {/* Decorative Elements */}
    <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 bg-[#006D64]/10 rounded-full blur-3xl pointer-events-none"></div>
  </div>

  {/* Right Column - Services List */}
  <div className="w-full lg:w-1/2">
    {/* Section Header */}


    {/* Services List */}
    <div className="space-y-0">
      {services.map((service, index) => (
        <div key={service.id}>
          <button
            onClick={() => setActiveService(index)}
            className={`w-full text-left py-4 md:py-5 transition-all duration-300 group ${
              index === activeService ? 'bg-white' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                {/* Number */}
                <span
                  className={`text-base md:text-lg font-cal-sans font-medium transition-colors ${
                    index === activeService ? 'text-[#006D64]' : 'text-gray-400'
                  }`}
                >
                  {service.number}
                </span>

                {/* Title */}
                <h3
                  className={`text-lg md:text-xl lg:text-2xl font-cal-sans font-bold transition-colors ${
                    index === activeService ? 'text-[#006D64]' : 'text-black'
                  }`}
                >
                  {service.title}
                </h3>
              </div>

              {/* Icon */}
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  index === activeService
                    ? 'bg-[#006D64] text-white'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}
              >
                {index === activeService ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 md:w-5 md:h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                )}
              </div>
            </div>

            {/* Description - Shows when active */}
            {index === activeService && (
              <p className="mt-3 ml-10 md:ml-12 text-xs md:text-sm text-gray-600 font-golos leading-relaxed animate-fade-in">
                {service.description}
              </p>
            )}
          </button>

          {/* Divider */}
          {index < services.length - 1 && <div className="w-full h-px bg-gray-200"></div>}
        </div>
      ))}
    </div>
  </div>
</div>

      </div>
    </section>
  );
}