import Image from 'next/image';
import React from 'react';

interface TeamMember {
  id: string;
  number: string;
  name: string;
  role: string;
  isActive: boolean;
}

const Team: React.FC = () => {
  const teamMembers: TeamMember[] = [
    { id: '1', number: '01', name: 'Marwen Frikha', role: 'Architecte Senior', isActive: true },
    { id: '2', number: '02', name: 'Rym Zouari', role: 'Architecte Urbaniste', isActive: false },
    { id: '3', number: '03', name: 'Sofien Boughanmi', role: 'Fondateur de Studio', isActive: false },
    { id: '4', number: '04', name: 'Imen Rekik', role: "Architecte d'Intérieur", isActive: false },
    { id: '5', number: '05', name: 'Mourad Ben Abdallah', role: 'Architecte Paysagiste', isActive: false },
  ];
  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-white overflow-hidden">
      <div className="px-4 md:px-8 lg:px-16 xl:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Badge */}
                    <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
équipe de conception incroyable  </span>
</div>

<div className="relative lg:translate-x-[400px] lg:-translate-y-[40px]">
  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-black leading-[1.1] mb-6">
    <span className="text-black-600">Qui Sommes-Nous&nbsp;?</span>
  </h1>

  <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
    Nous sommes une équipe d’ingénieurs et de spécialistes du bâtiment, passionnés par la digitalisation et l’optimisation des projets.
    Notre mission :
    faciliter le pilotage des projets en génie civil grâce à une solution simple, moderne et gratuite.
  </p>
</div>

   <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-6">
        {/* Image */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/assets/team.png"
              alt="Team member"
              width={800}
              height={750}
              className="object-cover w-full h-auto"
              priority
            />
          </div>
        </div>

            {/* Right Column - Team Members List */}
            <div className="order-1 lg:order-2 space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="group cursor-pointer"
                >
                  <div className="py-4 md:py-6 border-t-2 border-gray-100 hover:border-teal-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <span className={`text-base md:text-lg font-medium ${member.isActive ? 'text-teal-700' : 'text-gray-400'}`}>
                          {member.number}
                        </span>
                        <div className="flex-1">
                          <h3 className={`text-2xl md:text-3xl lg:text-4xl font-cal-sans mb-1 ${member.isActive ? 'text-teal-700' : 'text-black'} group-hover:text-teal-700 transition-colors`}>
                            {member.name}
                          </h3>
                          <p className={`text-sm md:text-base ${member.isActive ? 'text-gray-600' : 'text-gray-500'}`}>
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {member.isActive ? (
                          <svg className="w-8 h-8 md:w-10 md:h-10 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;