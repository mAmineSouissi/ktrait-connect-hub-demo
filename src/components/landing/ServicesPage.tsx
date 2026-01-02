'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  bulletPoints?: string[];
  footerTitle?: string;
  image: string;
  imagePosition?: 'left' | 'right' | 'center';
}

const ServicesPage: React.FC = () => {
  const services: Service[] = [
    {
      id: '1',
      title: 'Gestion De Projet',
      description: 'Planification et suivi de toutes les étapes de votre projet de construction pour garantir :',
      bulletPoints: [
        'Une gestion rigoureuse du planning',
        'Des coûts maîtrisés',
        'Une coordination optimale entre tous les intervenants',
        'Un pilotage précis et transparent'
      ],
        footerTitle: 'Pilotage précis, décision rapide.',
      image: '/assets/services/project-management.jpg',
      imagePosition: 'left'
    },
    {
      id: '2',
      title: 'Études Et Ingénierie',
      description: 'Nous offrons des solutions sur mesure pour répondre à vos besoins spécifiques, incluant :',
      bulletPoints: [
        'Études de faisabilité',
        'Conception et dimensionnement',
        'Calculs de structures',
        'Plans d\'exécution détaillés'
      ],
        footerTitle: 'Solutions techniques adaptées à vos contraintes.',
      image: '/assets/services/engineering.jpg',
      imagePosition: 'center'
    },
    {
      id: '3',
      title: 'Accompagnement Administratif',
      description: 'Un accompagnement complet dans toutes vos démarches administratives :',
      bulletPoints: [
        'Dossiers d\'autorisation de construire',
        'Gestion des permis et autorisations',
        'Constitution de dossiers réglementaires',
        'Suivi des obligations légales',
        'Interface avec les administrations et organismes'
      ],
        footerTitle: 'Réduisez les coûts, améliorez le confort et la durabilité.',
      image: '/assets/services/administrative.jpg',
      imagePosition: 'right'
    },
    {
      id: '4',
      title: 'Support, Conseil Et Formation',
      description: 'Nous proposons également un soutien à tous les niveaux :',
      bulletPoints: [
        'Conseils techniques personnalisés',
        'Formation de vos équipes',
        'Accompagnement personnalisé, expertise technique'
      ],
        footerTitle: 'Accompagnement humain, expertise technique.',
      image: '/assets/services/support.jpg',
      imagePosition: 'left'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
           <div className="mb-12">
                  <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
EXPERTISES  </span>
</div>
    <div
  className={`
    relative max-w-full lg:max-w-4xl
    lg:relative lg:translate-x-[350px] lg:-translate-y-[30px]
  `}
>

  <h2 className="text-xl text-[#006D64] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-cal-sans font-bold  leading-tight mb-4 md:mb-6">
   Des Services Complets Pour<br />
    <span className="text-black"> Concevoir, Optimiser Et Piloter Vos Projets.</span>
  </h2>

  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-golos max-w-full lg:max-w-3xl font-medium leading-relaxed">
            Une équipe multidisciplinaire et expérimentée pour accompagner vos projets de la conception à la réalisation finale avec rigueur et expertise.
  </p>
</div>
          </div>

        {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
  {services.map((service, index) => {
    const isCenter = index === 1;
    const isBottomLeft = index === 3;
    const isTallImage = index % 2 === 1;

    return (
      <div
        key={service.id}
        className={`
          group relative
          ${isCenter ? "md:row-span-2" : ""}
          ${isBottomLeft ? "md:mt-16" : ""}
        `}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
        }}
      >
        <Link href="/gestionprojet" className="block">

        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">

          {/* Image */}
<div
  className={`
    relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300
    ${isTallImage ? "aspect-[3/4]" : "aspect-[16/9]"}
  `}
>            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {service.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-600 mb-4">
              {service.description}
            </p>

           {service.bulletPoints && service.bulletPoints.length > 0 && (
  <ul className="space-y-2">
    {service.bulletPoints.map((point, idx) => (
      <li
        key={idx}
        className="flex gap-3 text-gray-700 text-sm sm:text-base"
      >
        <span className="w-1 h-1 bg-gray-600 rounded-full mt-2" />
        <span>{point}</span>
      </li>
    ))}
  </ul>
)}

            {service.footerTitle && (
  <h4 className="mt-4 text-sm sm:text-base font-bold text-black leading-tight">
    {service.footerTitle}
  </h4>
)}

          </div>

          {/* Hover Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-teal-500 transition-all pointer-events-none" />
        </div>
      </Link>
    </div>
    );
  })}
</div>


      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesPage;