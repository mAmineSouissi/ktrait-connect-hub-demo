
'use client';

import Image from "next/image";


export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      rating: 4.80,
      totalReviews: '2 688 avis',
      quote: '« Une expérience formidable ! Ils savaient ce qu\'ils faisaient et ont fait preuve d\'une expertise exceptionnelle tout au long du processus. »',
      highlight: 'Du concept à la réalité, l\'équipe a transformé ma vision en un espace magnifique et agréable à vivre. Je suis absolument ravie !',
      name: 'Monir Ben Romdhane',
      role: 'Propriétaire de l\'entreprise',
      image: '/assets/img1.png',
    },
  ];

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
            {/* Green circle inside */}
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

            {/* Text */}
            <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
              NOS CLIENTS DISENT
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold text-black leading-tight 
               lg:translate-x-[300px] lg:-translate-y-[40px]">
            Voici Les <span className="text-[#006D64]">Mots Chaleureux</span><br />
            Que Disent Nos Clients
          </h2>

        </div>

        {/* Testimonial Content */}
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Column - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={testimonial.image}
                  alt="Client testimonial"
                  className="w-full h-auto object-cover"
                  width={500}
                  height={300}
                  priority={true}
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2">
              {/* Rating */}
              {/* Rating */}
              <div className="flex flex-col gap-3 mb-6 md:mb-8">

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-cal-sans font-bold">
                    {testimonial.rating}
                  </span>

                  <div className="flex flex-col bg-[#006D64] text-white px-4 py-3 rounded-full items-center">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 md:w-5 md:h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-golos mt-1">
                      {testimonial.totalReviews}
                    </span>
                  </div>


                  {/* Testimonial text */}
                  <p className="text-sm md:text-base lg:text-sm text-black font-normal leading-relaxed">
                    Du concept à la réalité, équipe a transformé ma vision en un espace magnifique et agréable à vivre. Je suis absolument ravie !
                  </p>

                </div>
              </div>



              {/* Highlight Text */}
              <p className="text-sm md:text-base lg:text-lg text-black font-golos mb-6 md:mb-8 leading-relaxed">
                {testimonial.highlight}
              </p>

              {/* Main Quote */}
              <blockquote className="text-lg md:text-xl lg:text-xl xl:text-xl font-serif font-thin text-black leading-relaxed mb-6 md:mb-8">
                {testimonial.quote}
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center gap-3 md:gap-4 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#006D64]/30 to-[#006D64]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-[#006D64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base md:text-lg lg:text-xl font-cal-sans font-bold text-black">
                    {testimonial.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 font-golos">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}