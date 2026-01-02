'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Projects() {
  const [activeFilters, setActiveFilters] = useState({
    residential: false,
    commercial: false,
    industrial: false
  });

  const projects = [
    {
      id: 1,
      category: 'Résidentiel',
      categoryLabel: 'RÉSIDENTIEL',
      title: 'Conception De Villa Résidentielle',
      subtitle: 'Villa de la Mer',
      location: 'Gammarth, Tunis',
      image: '/assets/h1.png',
    },
    {
      id: 2,
      category: 'Commercial',
      categoryLabel: 'COMMERCIAL',
      title: 'Design De Complexe Commercial',
      subtitle: 'Complexe Les Jardins du Lac',
      location: 'Les Berges du Lac, Tunis',
      image: '/assets/h2.png',
    },
    {
      id: 3,
      category: 'Industriel',
      categoryLabel: 'COMMERCIAL',
      title: "Rénovation D'Infrastructure",
      subtitle: "Rénovation de l'École El-Mourouj",
      location: 'El-Mourouj, Ben Arous',
      image: '/assets/h3.png',
    },
    {
      id: 4,
      category: 'Commercial',
      categoryLabel: 'COMMERCIAL',
      title: 'Construction De Bâtiment Industriel',
      subtitle: 'Usine de Production de Sfax',
      location: 'Sfax',
      image: '/assets/h4.png',
    },
  ];

  const toggleFilter = (filter: 'residential' | 'commercial' | 'industrial') => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  }
  const hasActiveFilters = Object.values(activeFilters).some(v => v);

  const filteredProjects = hasActiveFilters
    ? projects.filter(p => {
        if (activeFilters.residential && p.category === 'Résidentiel') return true;
        if (activeFilters.commercial && p.category === 'Commercial') return true;
        if (activeFilters.industrial && p.category === 'Industriel') return true;
        return false;
      })
    : projects;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16">
        {/* Header with Badge */}
        <div className="mb-8 md:mb-12">
        <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
              Nos Projets
  </span>
</div>

<div className="relative lg:translate-x-[300px] lg:-translate-y-[40px]">
  {/* Heading */}
  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-[1.1] mb-6">
    <span className="text-teal-600">Découvrez Nos Projets</span>
    <br />
    Et Types De Projets
  </h1>

  {/* Paragraph */}
  <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
    Des réalisations innovantes et optimisées pour tous vos besoins en génie civil.
  </p>

  {/* Right corner image */}
<Image
  src="/assets/pj.png"
  alt="Project illustration"
  width={700}
  height={400}
  className="absolute -top-40 -right-10 w-60 h-60 lg:w-80 lg:h-[60rem] object-cover"
/>

</div>


        </div>

        {/* Filter Dropdowns */}
<div className="flex flex-wrap gap-4 mb-10 md:mb-14 items-center justify-center lg:max-w-[1100px] lg:mx-auto">

  {/* Résidentiel */}
  <div className="relative">
    <button
      onClick={() => toggleFilter('residential')}
      className={`min-w-[170px] px-6 py-3 rounded-full border-2 text-sm font-medium 
                  transition-all duration-300 flex items-center justify-between gap-3 ${
        activeFilters.residential
          ? 'bg-teal-600 text-white border-teal-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
      }`}
    >
      <span>Résidentiel</span>
      <svg
        className={`w-4 h-4 transition-transform ${
          activeFilters.residential ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>

  {/* Commercial */}
  <div className="relative">
    <button
      onClick={() => toggleFilter('commercial')}
      className={`min-w-[170px] px-6 py-3 rounded-full border-2 text-sm font-medium 
                  transition-all duration-300 flex items-center justify-between gap-3 ${
        activeFilters.commercial
          ? 'bg-teal-600 text-white border-teal-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
      }`}
    >
      <span>Commercial</span>
      <svg
        className={`w-4 h-4 transition-transform ${
          activeFilters.commercial ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>

  {/* Industriel */}
  <div className="relative">
    <button
      onClick={() => toggleFilter('industrial')}
      className={`min-w-[170px] px-6 py-3 rounded-full border-2 text-sm font-medium 
                  transition-all duration-300 flex items-center justify-between gap-3 ${
        activeFilters.industrial
          ? 'bg-teal-600 text-white border-teal-600'
          : 'bg-white text-gray-700 border-gray-300 hover:border-teal-600'
      }`}
    >
      <span>Industriel</span>
      <svg
        className={`w-4 h-4 transition-transform ${
          activeFilters.industrial ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
<button
  className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
</button>

</div>

        {/* Projects Grid - Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="relative">
          {/* Mobile: Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-4 scrollbar-hide">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="w-[280px] flex-shrink-0 group cursor-pointer"
                  style={{
                    animation: `slideInFromBottom 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Image */}
                    <div className="relative h-[360px] overflow-hidden bg-gray-200">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold tracking-wider text-gray-800 rounded-full border border-gray-200">
                          {project.categoryLabel}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-lg font-bold mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-semibold text-teal-400">Titre :</span>{' '}
                          <span className="text-gray-200">{project.subtitle}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-teal-400">Emplacement :</span>{' '}
                          <span className="text-gray-200">{project.location}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
      {/* Desktop: Grid Layout */}
<div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
  {filteredProjects.map((project, index) => (
    <div
      key={project.id}
      className="group cursor-pointer"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
        marginTop: index % 2 === 0 ? '0px' : '40px', // stagger cards using margin instead of transform
      }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative h-[420px] overflow-hidden bg-gray-200">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          <div className="absolute top-4 right-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-bold tracking-wider text-gray-800 rounded-full border border-gray-200">
              {project.categoryLabel}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-3 leading-tight">{project.title}</h3>
          <div className="space-y-1.5 text-sm">
            <p>
              <span className="font-semibold text-teal-400">Titre :</span>{' '}
              <span className="text-gray-200">{project.subtitle}</span>
            </p>
            <p>
              <span className="font-semibold text-teal-400">Emplacement :</span>{' '}
              <span className="text-gray-200">{project.location}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

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

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}