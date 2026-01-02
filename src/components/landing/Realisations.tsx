"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  tags: string[];
  image: string;
  size: 'small' | 'large';
}

const Realisations: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState({
    residential: false,
    commercial: false,
    industrial: false
  });

  const projects: Project[] = [
    {
      id: '1',
      title: 'Design De Complexe Commercial',
      category: 'Commercial',
      location: 'Les Berges du Lac',
      year: '2023',
      tags: ['Commercial', 'Design'],
      image: '/assets/projects/commercial-complex.jpg',
      size: 'small'
    },
    {
      id: '2',
      title: "Rénovation D'Infrastructure",
      category: 'Infrastructure',
      location: "L'Alouette, Ben Arous",
      year: '2023',
      tags: ['Infrastructure', 'Rénovation'],
      image: '/assets/projects/infrastructure.jpg',
      size: 'small'
    },
    {
      id: '3',
      title: "Aménagement D'Établissement",
      category: 'Établissement',
      location: 'Sfanta',
      year: '2024',
      tags: ['Établissement', 'Aménagement'],
      image: '/assets/projects/establishment.jpg',
      size: 'small'
    },
    {
      id: '4',
      title: 'Conception De Villa Résidentielle',
      category: 'Résidentiel',
      location: 'Corniche, Tunis',
      year: '2022',
      tags: ['Résidentiel', 'Conception'],
      image: '/assets/projects/residential-villa.jpg',
      size: 'small'
    },
    {
      id: '5',
      title: 'Design De Complexe Commercial',
      category: 'Commercial',
      location: 'Les Berges du Lac, Tunis',
      year: '2023',
      tags: ['Commercial', 'Design'],
      image: '/assets/projects/commercial-complex.jpg',
      size: 'small'
    },
    {
      id: '6',
      title: "Rénovation D'Infrastructure",
      category: 'Infrastructure',
      location: "L'Alouette, Ben Arous",
      year: '2024',
      tags: ['Infrastructure', 'Rénovation'],
      image: '/assets/projects/infrastructure.jpg',
      size: 'small'
    },
    {
      id: '7',
      title: "Construction De Bâtiment Industriel",
      category: 'Industriel',
      location: "L'usine de Production de Vitre",
      year: '2023',
      tags: ['Industriel', 'Construction'],
      image: '/assets/projects/industrial.png',
      size: 'small'
    },
    {
      id: '8',
      title: 'Conception De Villa Résidentielle',
      category: 'Résidentiel',
      location: 'Corniche, Tunis',
      year: '2024',
      tags: ['Résidentiel', 'Conception'],
      image: '/assets/projects/residential-villa.jpg',
      size: 'small'
    },
    {
      id: '9',
      title: 'Design De Complexe Commercial',
      category: 'Commercial',
      location: 'Les Berges du Lac, Tunis',
      year: '2024',
      tags: ['Commercial', 'Design'],
      image: '/assets/projects/commercial-complex.jpg',
      size: 'small'
    }
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
    <div className="min-h-screen bg-white">
  
      {/* Filter and Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
              {/* Green circle inside */}
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

              {/* Text */}
              <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
                CATALOGUE
              </span>
            </div>
            
            <div className="relative max-w-full lg:max-w-4xl lg:relative lg:translate-x-[350px] lg:-translate-y-[30px]">
              <h2 className="text-xl text-[#006D64] sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-cal-sans font-bold leading-tight mb-4 md:mb-6">
                Découvrez Nos Projets <br />
                <span className="text-black">Et Types De Projets</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 font-golos max-w-full lg:max-w-3xl font-medium leading-relaxed">
                Des réalisations innovantes et optimisées pour tous vos besoins en génie civil.
              </p>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-10 md:mb-14 px-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center lg:max-w-[1100px] lg:mx-auto">

              {/* Résidentiel */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => toggleFilter('residential')}
                  className={`w-full sm:min-w-[170px] px-5 sm:px-6 py-3 rounded-full border-2 text-sm font-medium
                    transition-all duration-300 flex items-center justify-between gap-3 ${
                      activeFilters.residential
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
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
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => toggleFilter('commercial')}
                  className={`w-full sm:min-w-[170px] px-5 sm:px-6 py-3 rounded-full border-2 text-sm font-medium
                    transition-all duration-300 flex items-center justify-between gap-3 ${
                      activeFilters.commercial
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
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
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => toggleFilter('industrial')}
                  className={`w-full sm:min-w-[170px] px-5 sm:px-6 py-3 rounded-full border-2 text-sm font-medium
                    transition-all duration-300 flex items-center justify-between gap-3 ${
                      activeFilters.industrial
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
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

              {/* Search Button */}
              <button
                aria-label="Search"
                className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all duration-300 shadow-md hover:scale-105"
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
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Project Image Container */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Subtle Gradient Overlay on Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Category Badge - Positioned on Image */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[#006D64] text-xs font-semibold rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content Section Below Image */}
                <div className="p-5 bg-white">
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#006D64] transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#006D64] font-semibold min-w-[45px]">Titre :</span>
                      <span className="font-medium">{project.title}</span>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#006D64] font-semibold min-w-[45px]">Emplacement :</span>
                      <span className="font-medium">{project.location}</span>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#006D64] rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

        </div>
      </section>

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
    </div>
  );
};

export default Realisations;