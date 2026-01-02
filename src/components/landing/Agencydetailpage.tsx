'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Activity {
  id: string;
  title: string;
  description: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const AgencyDetailPage: React.FC = () => {
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Supervision et coordination',
      description: 'Coordination de tous les aspects d\'un projet, de sa conception à sa réalisation complète.',
    },
    {
      id: '2',
      title: 'Étude d\'implantation',
      description: 'Étude approfondie du site pour optimiser l\'implantation et l\'intégration du projet.',
    },
    {
      id: '3',
      title: 'Méthode de travail collaborative',
      description: 'Approche collaborative favorisant les échanges entre tous les intervenants du projet.',
    },
    {
      id: '4',
      title: 'Suivi des coûts',
      description: 'Surveillance rigoureuse du budget pour garantir le respect des coûts prévisionnels.',
    },
    {
      id: '5',
      title: 'Innovation et durabilité',
      description: 'Intégration de solutions innovantes et durables dans tous nos projets.',
    },
  ];

  const projects: Project[] = [
    {
      id: '1',
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.',
      image: '/assets/agency/project-1.png',
      link: '/projets/1',
    },
    {
      id: '2',
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Veniam quis nostrud.',
      image: '/assets/agency/project-2.png',
      link: '/projets/2',
    },
    {
      id: '3',
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore. Ut enim ad minim veniam.',
      image: '/assets/agency/project-3.png',
      link: '/projets/3',
    },
    {
      id: '4',
      title: 'Lorem Ipsum Dolor Sit Amet',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: '/assets/agency/project-4.png',
      link: '/projets/4',
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 sm:space-y-10 md:space-y-12">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[16/9]">
              <Image
                src="/assets/agency/hero.png"
                alt="Agency showcase"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>

            {/* Agency Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                ARCHITEX INTERNATIONAL
              </h1>
              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                <p>
                  Architex International est une agence d&apos;architecture et d&apos;ingénierie avant-gardiste offrant des services intégrés pour concevoir, planifier et réaliser des projets innovants. Nous combinons expertise technique et vision créative pour transformer vos idées en réalités architecturales d&apos;exception.
                </p>
                <p>
                  Notre équipe multidisciplinaire maîtrise l&apos;ensemble du processus de conception, de l&apos;esquisse initiale à la réalisation finale. Nous nous engageons à créer des espaces qui répondent aux besoins fonctionnels tout en respectant les contraintes environnementales et budgétaires.
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
                Les Projets De L&apos;agence
              </h2>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <Link href={project.link} className="block">
                      {/* Project Image */}
                      <div className="relative rounded-xl overflow-hidden shadow-lg mb-4 aspect-[4/3] bg-gray-200">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                      </div>

                      {/* Project Info */}
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activities Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6 sm:space-y-8">
              {/* Activities Card */}
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-md">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Les Activités De L&apos;agence
                </h2>

                {/* Activities List */}
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="relative pl-6 border-l-2 border-teal-500"
                      style={{
                        animation: `fadeInRight 0.6s ease-out ${index * 0.08}s both`,
                      }}
                    >
                      {/* Dot indicator */}
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-teal-500"></div>

                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

 
            </div>
          </div>
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

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default AgencyDetailPage;