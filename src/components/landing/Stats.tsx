export default function Stats() {
  const stats = [
    {
      number: '2007',
      title: 'Des années d\'expérience',
      description: 'Améliorer les maisons grâce à un savoir-faire artisanal depuis des années',
    },
    {
      number: '190+',
      title: 'Projets terminés',
      description: 'Plus de 250 projets réussis livrés avec qualité et soin',
    },
    {
      number: '260+',
      title: 'Artisans qualifiés',
      description: 'Notre équipe de 30 experts garantit des résultats de qualité supérieure',
    },
    {
      number: '328+',
      title: 'Satisfaction des clients',
      description: 'Tous nos clients sont satisfaits de notre travail et de notre service',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center md:text-left">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-normal font-cal-sans text-black mb-4">
                {stat.number}
              </h3>
              <div className="w-full h-px bg-gray-300 mb-4"></div>
              <h4 className="text-xl md:text-xl font-semibold font-cal-sans text-black mb-3">
                {stat.title}
              </h4>
              <p className="text-sm md:text-base text-gray-600 font-golos">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}