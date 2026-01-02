'use client';

import React, { JSX, useState } from 'react';
import Image from 'next/image';
import ConsultationFormFull from './Consultationform';

interface Service {
  id: string;
  title: string;
  icon: JSX.Element;
}

const ConsultationFormServices: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showFullForm, setShowFullForm] = useState(false); 

  const services: Service[] = [
    {
      id: 'juridique',
      title: 'Consultation Juridique',
      icon: (
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      id: 'technique',
      title: 'Consultation Technique',
      icon: (
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];
  if (showFullForm) {
    return <ConsultationFormFull selectedService={selectedService} />;
  }
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
    style={{
    backgroundImage: "url('/assets/plann.png')", 
  }}>
      <div className="max-w-7xl mx-auto">
           
  <div className="mb-8 md:mb-12 lg:mb-16 max-w-3xl">
    
             <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
  {/* Green circle inside */}
  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

  {/* Text */}
  <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
                  Demander un devis
  </span>
</div>
<div
  className={`
    relative max-w-full lg:max-w-4xl
    lg:translate-x-[300px] lg:-translate-y-[40px]
  `}
>
  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-cal-sans font-bold text-black leading-tight mb-4 md:mb-6">
    Formulaire de<br />
    <span className="text-[#006D64]">Consultation et de Devis</span>
  </h2>
</div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Side - Image */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center">
<div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl aspect-[3/2] lg:aspect-[4/3]">
  <Image
    src="/assets/devis/consultation-team.jpg"
    alt="Consultation team"
    fill
    className="object-cover"
    sizes="(max-width: 1024px) 100vw, 60vw"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
</div>


</div>


          {/* Right Side - Form */}
<div className="lg:col-span-6 order-1 lg:order-2 flex items-center">
            <div className="w-full">    
            {/* Service Selection Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`group relative bg-white rounded-2xl p-6 sm:p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                      selectedService === service.id
                        ? 'border-teal-500 shadow-lg shadow-teal-100'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Icon */}
                 <div className="flex justify-center mb-6">
  <div
    className={`relative w-16 h-16 transition-transform duration-300 ${
      selectedService === service.id
        ? 'scale-110'
        : 'group-hover:scale-105'
    }`}
  >
    <Image
      src={
        service.id === 'juridique'
          ? '/assets/devis/icon1.png'
          : '/assets/devis/icon2.png'
      }
      alt={service.title}
      fill
      className="object-contain"
    />
  </div>
</div>


                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center">
                      {service.title}
                    </h3>

                    {/* Selected indicator */}
                    {selectedService === service.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
        <button
          disabled={!selectedService}
          onClick={() => setShowFullForm(true)} // show full form on click
          className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 ${
            selectedService
              ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:from-teal-700 hover:to-teal-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Envoyer Un Message</span>

          <span className={`w-10 h-10 flex items-center justify-center rounded-full relative transition-all duration-300 ${
            selectedService ? 'bg-white/20 group-hover:bg-white/30' : 'bg-white/10'
          }`}>
            <Image
              src="/assets/arrow.png"
              alt="Arrow"
              width={16}
              height={16}
              className="w-3 h-3 md:w-4 md:h-4"
            />
          </span>
        </button>
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
      `}</style>
    </section>
  );
};

export default ConsultationFormServices;