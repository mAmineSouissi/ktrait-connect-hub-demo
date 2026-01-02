"use client";

import React, { useState } from 'react';

interface Offering {
  id: string;
  number: string;
  title: string;
  isActive: boolean;
}

const Offerings: React.FC = () => {
  const [offerings] = useState<Offering[]>([
    { id: '01', number: '01', title: 'Pilotage de Projets Neufs', isActive: true },
    { id: '02', number: '02', title: 'Amélioration & Rénovation', isActive: false },
    { id: '03', number: '03', title: 'Études de Faisabilité', isActive: false },
    { id: '04', number: '04', title: 'Suivi de Chantier', isActive: false },
    { id: '05', number: '05', title: 'Gestion Budgétaire et Suivi', isActive: false },
    { id: '06', number: '06', title: 'Optimisation des Coûts', isActive: false },
  ]);

  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="px-4 md:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Badge */}
          <div className="inline-flex items-center border border-gray-300 rounded-full px-6 py-2 mb-6">
            <span className="text-xs md:text-sm text-black">nos prestations</span>
          </div>

          {/* Section Heading */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-cal-sans text-black leading-tight mb-6">
              Explorez notre Expertise<br />
              en Gestion de <span className="text-teal-700">Projets Immobiliers</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl">
              Nous sommes spécialisés dans la concrétisation de vos visions. Découvrez notre portefeuille de projets réussis, livrés dans les délais et avec une précision exemplaire.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Image/Visual */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-2xl">
                    <svg className="w-32 h-32 md:w-40 md:h-40 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Offerings List */}
            <div className="order-1 lg:order-2 space-y-4">
              {offerings.map((offering, index) => (
                <div
                  key={offering.id}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center justify-between py-4 border-b border-gray-200 hover:border-teal-600 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <span className={`text-base md:text-lg font-medium ${offering.isActive ? 'text-teal-700' : 'text-gray-400'}`}>
                        {offering.number}
                      </span>
                      <h3 className={`text-xl md:text-3xl lg:text-4xl font-cal-sans ${offering.isActive ? 'text-teal-700' : 'text-black'} group-hover:text-teal-700 transition-colors`}>
                        {offering.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {offering.isActive ? (
                        <svg className="w-10 h-10 md:w-12 md:h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-teal-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mt-16 md:mt-24">
            {[
              { number: '2007', label: "Des années d'expérience", description: "Améliorer les maisons grâce à un savoir-faire artisanal depuis des années" },
              { number: '190+', label: 'Projets terminés', description: 'Plus de 250 projets réussis livrés avec qualité et soin' },
              { number: '260+', label: 'Artisans qualifiés', description: 'Notre équipe de 30 experts garantit des résultats de qualité supérieure' },
              { number: '328+', label: 'Satisfaction des clients', description: 'Tous nos clients sont satisfaits de notre travail et de notre service' }
            ].map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="text-4xl md:text-5xl lg:text-6xl font-cal-sans text-black mb-4">
                  {stat.number}
                </div>
                <div className="h-px bg-gray-300 mb-4"></div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-cal-sans text-black mb-3">
                  {stat.label}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed hidden lg:block">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offerings;