'use client';

export default function Process() {
  const steps = [
    {
      number: '01',
      title: 'Consultation & Planification',
      description: 'Nous commençons par comprendre votre vision, vos objectifs et vos besoins pour établir une stratégie sur mesure.',
      image: '/assets/process1.png',
    },
    {
      number: '02',
      title: 'Sélection Des Partenaires',
      description: 'Notre équipe sélectionne les architectes et les corps de métier les plus fiables, capables de répondre parfaitement',
      image: '/assets/process2.png',
    },
    {
      number: '03',
      title: 'Pilotage & Partenariats',
      description: 'Avec des entrepreneurs rigoureusement sélectionnés, nous gérons chaque phase du projet en assurant la qualité',
      image: '/assets/process3.png',
    },
    {
      number: '04',
      title: 'Réception & Livraison Finale',
      description: 'Une fois les travaux terminés, nous effectuons un examen approfondi, en nous assurant que tous les détails et délais sont respectés.',
      image: '/assets/process4.png',
    },
  ];

  return (
    <section className="relative py-12 md:py-16 lg:py-24 bg-white overflow-hidden">
      
    {/* Watermark Text - Top Left */}
<div className="absolute top-8 left-4 md:left-8 lg:left-44 opacity-10 pointer-events-none mt-18">
  <span className="text-6xl md:text-8xl lg:text-[15rem] font-cal-sans font-bold text-gray-400 leading-none tracking-widest transform scale-x-125 -mt-7">
    ktrait
  </span>
  {/* <img
    src="/assets/ktrait.png" // your watermark image
    alt="Watermark"
    className="w-64 md:w-96 lg:w-[500px] object-cover"
  /> */}
</div>


      {/* 3D House Image - Top Right */}
      <div className="absolute top-0 right-0 w-1/2 md:w-2/5 lg:w-1/3 opacity-90 pointer-events-none hidden md:block">
        <img
          src="/assets/house3d.png"
          alt="3D House"
          className="w-full h-auto"
        />
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-90 mt-64"
        style={{
          backgroundImage: "url('/assets/processbg.png')",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-44">
        {/* Section Header */}
        <div className="mb-8 md:mb-12 lg:mb-16 max-w-3xl">
             <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
COMMENT NOUS TRAVAILLONS
  </span>
</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold text-black leading-tight mb-4 md:mb-6">
            Processus De Gestion<br />
            De <span className="text-[#006D64]">Projets Immobiliers</span><br />
            Pour Une <span className="text-[#006D64]">Réalisation Réussie.</span>
          </h2>

          <p className="text-sm md:text-base lg:text-lg text-gray-600 font-golos leading-relaxed">
            Notre processus est dynamique : il s&apos;adapte, s&apos;affine et évolue avec votre vision. En l&apos;actualisant sans cesse, notre gestion parvient à des résultats concrets.
          </p>
        </div>

{/* Process Steps Grid - Staircase Style */}
<div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
  {steps.map((step, index) => (
    <div
      key={index}
      className="bg-white rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      style={{
        // Only offset for lg (desktop)
        transform: `translate(${index * 1.5}rem, ${index * 1.5}rem)`,
      }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
          <span className="text-base md:text-xl lg:text-2xl font-cal-sans font-bold text-[#006D64]">
            {step.number}.
          </span>
          <h3 className="text-base md:text-lg lg:text-xl font-cal-sans font-bold text-black leading-tight">
            {step.title}
          </h3>
        </div>

        <p className="text-xs md:text-sm text-gray-600 font-golos leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  ))}
</div>

<style jsx>{`
  @media (max-width: 1023px) { /* lg breakpoint and below */
    div[style] {
      transform: none !important; /* Remove staircase offsets for mobile/tablet */
    }
  }
`}</style>



        {/* Bottom CTA */}
        <div className="mt-8 md:mt-12 lg:mt-32 text-center">
          <p className="text-sm md:text-base lg:text-base font-normal text-black">
            Nous avons travaillé dur pour vous impressionner.{' '}
            <span className="font-semibold text-[#006D64] cursor-pointer hover:underline">
              Découvrez nos services
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}