'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
}

const PortfolioGrid: React.FC = () => {
  const projects: Project[] = [
    {
      id: '1',
      title: 'ARCH PROJECT PARK+POOL',
      category: 'Architecture',
      description: 'Conception et réalisation d\'un complexe moderne avec espace vert et piscine intégrée pour un cadre de vie exceptionnel.',
      image: '/assets/portfolio/project-1.png',
    },
    {
      id: '2',
      title: 'GRES ARCHITECTS',
      category: 'Architecture',
      description: 'Design architectural contemporain avec des lignes épurées et une intégration harmonieuse dans l\'environnement urbain.',
      image: '/assets/portfolio/project-2.png',
    },
    {
      id: '3',
      title: 'ELIE ENGINEERING',
      category: 'Ingénierie',
      description: 'Projet d\'ingénierie structurelle complexe alliant innovation technique et esthétique moderne.',
      image: '/assets/portfolio/project-3.png',
    },
    {
      id: '4',
      title: 'ARC GENIE ACES',
      category: 'Génie Civil',
      description: 'Réalisation d\'infrastructures durables avec une approche respectueuse de l\'environnement et des normes les plus strictes.',
      image: '/assets/portfolio/project-4.png',
    },
    {
      id: '5',
      title: 'EASY EXPERTISE',
      category: 'Expertise',
      description: 'Services d\'expertise technique et conseil en génie civil pour des projets de grande envergure.',
      image: '/assets/portfolio/project-5.png',
    },
    {
      id: '6',
      title: 'CONSTRUCTION',
      category: 'Construction',
      description: 'Construction de bâtiments résidentiels et commerciaux avec des standards de qualité exceptionnels.',
      image: '/assets/portfolio/project-6.png',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
       <div className="mb-12">
                  <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
PORTFOLIO  </span>
</div>
    <div
  className={`
    relative max-w-full lg:max-w-4xl
    lg:relative lg:translate-x-[350px] lg:-translate-y-[30px]
  `}
>

  <h2 className="text-xl text-black  sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-cal-sans font-bold  leading-tight mb-4 md:mb-6">
   Construire Ensemble <br />
    <span className="text-[#006D64]"> Des Projets Durables Et Performants.</span>
  </h2>

  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-golos max-w-full lg:max-w-3xl font-medium leading-relaxed">
            Découvrez nos réalisations qui allient innovation, durabilité et excellence technique.
  </p>
</div>
          </div>

        {/* Projects Grid - 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Card Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300">
<Image
  src={project.image}
  alt={project.title}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

<div
  className="absolute inset-0 bg-cover bg-center opacity-70 pointer-events-none"
  style={{
    backgroundImage: "url('/assets/portfolio/overlay.png')",
  }}
/>


                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs font-medium">
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight tracking-wide uppercase">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-5 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Button */}
                   <div className="flex items-center">
  <Link
    href="/detailsagence"
    className="group inline-flex items-center gap-3 text-white hover:text-teal-400 transition-all duration-300"
  >
    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
      Découvrir
    </span>

    <span className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#006D64] rounded-full relative -translate-y-[10%] transition-all duration-300 group-hover:scale-110">
      <Image
        src="/assets/arrow.png"
        alt="Arrow"
        width={12}
        height={12}
        className="w-2 h-2 md:w-3 md:h-3 transition-transform duration-300 group-hover:translate-x-1"
      />
    </span>
  </Link>
</div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-500/50 transition-all duration-300 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            </div>
          ))}
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

export default PortfolioGrid;