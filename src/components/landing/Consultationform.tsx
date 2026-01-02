'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface ConsultationFormFullProps {
  selectedService: string | null;
}

const ConsultationFormFull: React.FC<ConsultationFormFullProps> = ({ selectedService }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  console.log('Selected service:', selectedService);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

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
     <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center lg:mt-0 mt-8">
  <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl aspect-[3/2] lg:aspect-[4/3] -translate-y-12 lg:-translate-y-16">
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
     <div className="lg:col-span-7 order-1 lg:order-2 flex items-start  mt-0 lg:mt-0">
  {/* Form */}
  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full">
    {/* Name and Phone Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-1">
          Nom complet*
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onFocus={() => setFocusedField('fullName')}
          onBlur={() => setFocusedField(null)}
          placeholder="Ton nom*"
          required
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 rounded-2xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${
            focusedField === 'fullName'
              ? 'border-teal-500 shadow-md shadow-teal-100'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1">
          Numéro du téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onFocus={() => setFocusedField('phone')}
          onBlur={() => setFocusedField(null)}
          placeholder="Numéro du téléphone"
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 rounded-2xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${
            focusedField === 'phone'
              ? 'border-teal-500 shadow-md shadow-teal-100'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      </div>
    </div>

    {/* Email and Subject Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1">
          Adresse émail*
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder="Adresse émail*"
          required
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 rounded-2xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${
            focusedField === 'email'
              ? 'border-teal-500 shadow-md shadow-teal-100'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-1">
          Sujet*
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onFocus={() => setFocusedField('subject')}
          onBlur={() => setFocusedField(null)}
          placeholder="Je veux"
          required
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 rounded-2xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${
            focusedField === 'subject'
              ? 'border-teal-500 shadow-md shadow-teal-100'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        />
      </div>
    </div>

    {/* Message */}
    <div>
      <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-1">
        Ton message*
      </label>
      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        onFocus={() => setFocusedField('message')}
        onBlur={() => setFocusedField(null)}
        placeholder=""
        required
        rows={7} // slightly taller
        className={`w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border-2 rounded-2xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none resize-none ${
          focusedField === 'message'
            ? 'border-teal-500 shadow-md shadow-teal-100'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      />
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        type="submit"
        className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800 overflow-hidden relative"
      >
        <span className="relative z-10">Envoyer Un Message</span>
        <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
          <Image
                       src="/assets/arrow.png"
                       alt="Arrow"
                       width={16}
                       height={16}
                       className="w-3 h-3 md:w-4 md:h-4"
                     />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </button>
    </div>
  </form>
</div>

        </div>
      </div>
    </section>
  );
};

export default ConsultationFormFull;