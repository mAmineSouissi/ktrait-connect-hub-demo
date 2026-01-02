'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const ProjectManagementSection: React.FC = () => {
  const sidebarItems = [
    'Études et ingénierie',
    'Accompagnement administratif',
    'Support, conseil et formation',
    'Gestion de projet'
  ];

  const features: Feature[] = [
    {
      id: '1',
      icon: 'chart',
      title: 'Lorem Ipsum Dolor',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.'
    },
    {
      id: '2',
      icon: 'users',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur elit sed do eiusmod tempor incididunt ut labore et dolore.'
    },
    {
      id: '3',
      icon: 'settings',
      title: 'Lorem Ipsum Dolor',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.'
    },
    {
      id: '4',
      icon: 'shield',
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.'
    }
  ];

  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case 'chart':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Service Menu */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Gestion De Projet
              </h3>
              <ul className="space-y-4">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <button className="w-full text-left flex items-center gap-3 text-sm sm:text-base font-semibold text-gray-700 hover:text-teal-600 transition-colors duration-300 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-teal-600 transition-colors duration-300"></span>
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                ></div>
              </div>

             <div className="relative h-[320px] sm:h-[380px] md:h-[450px] rounded-2xl overflow-hidden">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/assets/architecture-bg.jpg')" }}
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/55" />

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 sm:px-10">
    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-tight max-w-2xl">
      Échangez Avec Notre Équipe D&apos;architectes Dès Aujourd&apos;hui
    </h3>

    <Link
      href="/contact"
      className="group inline-flex items-center gap-3"
    >
      <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
        Consultations
      </span>

      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-teal-500 flex items-center justify-center group-hover:bg-teal-600 transition-all duration-300 group-hover:scale-110 shadow-lg">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </div>
    </Link>
  </div>
</div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden  aspect-[16/9] sm:aspect-[21/9]">
              <Image
                src="/assets/project-management-hero.png"
                alt="Project Management"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {/* Main Content */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Gestion De Projet
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                Notre équipe de gestion de projet vous accompagne à chaque étape pour assurer la réussite de votre construction. Nous mettons en place des méthodes éprouvées et des outils de suivi performants pour garantir le respect des délais, des budgets et de la qualité attendue. Notre approche collaborative favorise une communication fluide entre tous les intervenants du projet.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex gap-4 bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {renderIcon(feature.icon)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Two Images Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
                <Image
                  src="/assets/project-management-1.png"
                  alt="Project planning"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3]">
                <Image
                  src="/assets/project-management-2.png"
                  alt="Team collaboration"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Additional Content Sections */}
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Lorem Ipsum Dolor Sit Amet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Lorem Ipsum Dolor Sit Amet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default ProjectManagementSection;