'use client';

import React from 'react';
import Image from 'next/image';

interface TimelineItem {
  year: string;
  image: string;
  description: string;
}

const HistoryTimeline: React.FC = () => {
  const timelineData: TimelineItem[] = [
    {
      year: '1990',
      image: '/assets/1990.jpg',
      description: "L'entreprise est fondée par un designer axé sur la haute qualité résidentielle..."
    },
    {
      year: '2010',
      image: '/assets/2010.jpg',
      description: "Ouvre un deuxième bureau dans une ville voisine pour répondre à une demande croissante et entreprend des projets plus importants, tels que des espaces commerciaux et des restaurants."
    },
    {
      year: '2018',
      image: '/assets/2018.jpg',
      description: "Participe à un salon national de design intérieur présentant des concepts innovants et obtient une reconnaissance de l'industrie."
    },
    {
      year: '2025',
      image: '/assets/2025.png',
      description: "Célèbre ses 15 ans avec une rétrospective présentant les projets et les étapes les plus emblématiques de l'entreprise."
    }
  ];

  return (
    <section className="relative bg-white py-16 md:py-24 lg:py-32 px-4 overflow-hidden">
      {/* Subtle geometric background */}
    <div className="absolute inset-0 opacity-[0.02]">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        'radial-gradient(circle at 1px 1px, rgb(0 128 128) 0.6px, transparent 0)',
      backgroundSize: 'clamp(10px, 3vw, 2àpx) clamp(10px, 3vw, 28px)',
    }}
  />
</div>


      <div className="relative max-w-7xl mx-auto">
        {/* Section Badge */}
                 <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
Historique  </span>
</div>

        {/* Section Title */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="block text-gray-900 mb-2">Expertise Et Innovation</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
              Au Cœur Du Génie Civil
            </span>
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical timeline line - Mobile */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-teal-200 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500 to-transparent opacity-50"></div>
          </div>

          {/* Timeline Items */}
        <div className="max-w-7xl mx-auto">

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-[110px] left-0 right-0 h-px bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {timelineData.map((item) => (
              <div key={item.year} className="text-center relative">
                
                {/* Image */}
                <div className="mx-auto mb-6 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.year}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Dot */}
                <div className="mx-auto mb-6 w-3 h-3 rounded-full bg-[#006D64]" />

                {/* Year */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.year}
                </h3>

                {/* Text */}
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
        </div>
      </div>


    </section>
  );
};

export default HistoryTimeline;