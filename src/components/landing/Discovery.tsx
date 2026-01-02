import React from 'react';
import Image from 'next/image';

const Discovery: React.FC = () => {
  const features = [
    'Planifier Et Organiser Chaque Étape Des Projets',
    "Suivre L'avancement Des Travaux En Temps Réel",
    'Gérer Efficacement Les Budgets Et Les Ressources',
    'Centraliser Tous Les Documents Et Rapports Techniques',
    'Assurer Une Coordination Optimale Entre Tous Les Intervenants'
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Background architectural pattern */}
      <div className="absolute inset-0 ">
       <div
  className="absolute inset-0 bg-contain bg-center opacity-60" // optional opacity
  style={{
    backgroundImage: "url('/assets/house.png')",
  }}
></div>

      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Badge */}
                 <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
Débute en 2007  </span>
</div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-8 md:space-y-10">
            {/* Heading */}
            <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 font-cal-sans">
  Découvrir{' '}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-teal-800 font-cal-sans whitespace-nowrap">
    ktrait konstruction
  </span>
</h1>


              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl font-golos">
                Bienvenue sur <strong className="text-teal-700">ktrait konstruction</strong>, votre plateforme
                centralisée pour le suivi et le pilotage de tous vos projets de génie civil.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 md:space-y-5">
              <p className="text-sm md:text-base font-semibold font-golos text-gray-900 mb-6">
                Cette solution vous permet de :
              </p>
             {features.map((feature, index) => (
  <div
    key={index}
    className="flex items-start gap-3 group transition-all duration-300 hover:translate-x-2 font-cal-sans"
  >
    <div className="flex-shrink-0 mt-1">
      <svg
        className="w-5 h-5 md:w-6 md:h-6 text-teal-600 transition-transform duration-300 group-hover:scale-110"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <p className="text-lg md:text-xl font-semibold font-cal-sans text-gray-800 leading-relaxed">
      {feature}
    </p>
  </div>
))}

            </div>
          </div>

          {/* Right Column - Hero Images */}
          <div className="relative lg:flex lg:flex-col lg:items-end lg:space-y-8">
            {/* Top Image - modern architecture */}
           <div className="relative w-full lg:w-[430px] h-[400px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl 
                transform transition-all duration-700 hover:shadow-3xl hover:scale-[1.01] 
                -translate-y-12 lg:-translate-y-16 lg:translate-x-20">
  <Image
    src="/assets/modern-architecture.png"
    alt="Modern futuristic architectural building"
    fill
    className="object-cover"
    priority
    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
  />
</div>


            {/* Bottom Image - house */}
           <div className="relative w-full lg:w-[320px] h-[250px] md:h-[400px] md:mr-80   
                lg:-mt-120 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 
                hover:shadow-3xl hover:scale-[1.01]">
  <Image
    src="/assets/collaboration.png"
    alt="House building"
    fill
    className="object-cover"
    priority
    sizes="(max-width: 268px) 100vw, (max-width: 724px) 50vw, 50vw"
  />
</div>

          </div>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-30"></div>
    </section>
  );
};

export default Discovery;
