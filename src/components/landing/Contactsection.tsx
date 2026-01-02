'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 md:py-24 lg:py-32 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Badge */}
        <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
          {/* Green circle inside */}
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

          {/* Text */}
          <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
            Entrer en contact
          </span>
        </div>

        {/* Section Title */}
        <div className="relative max-w-full lg:max-w-4xl 
                lg:relative lg:translate-x-[300px] lg:-translate-y-[50px]">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-gray-900">Vous Avez Un Projet </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
              En Tête ?
            </span>
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-teal-700 mb-4">
            Réalisons-Le !
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Column - Contact Info & Image */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Address */}
              <div className="group">
                <h3 className="text-xs md:text-sm font-bold tracking-wider text-gray-500 uppercase mb-3">
                  Adresse :
                </h3>
                <p className="text-base md:text-lg text-gray-900 font-medium leading-relaxed">
                  17, Rue des Oliviers, Ben Arous.
                  <br />
                  Code postal : 2074.
                </p>
              </div>

              {/* Contact */}
              <div className="group">
                <h3 className="text-xs md:text-sm font-bold tracking-wider text-gray-500 uppercase mb-3">
                  Contact :
                </h3>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href="tel:+21698123456"
                    className="text-base md:text-lg text-teal-700 font-semibold hover:text-teal-800 transition-colors duration-300"
                  >
                    +216 98 123 456
                  </a>


                  <a
                    href="mailto:info@kraitengineering.com"
                    className="text-base md:text-lg text-gray-900 font-medium hover:text-teal-700 transition-colors duration-300"
                  >
                    info@kraitengineering.com
                  </a>
                </div>
              </div>

            </div>

            {/* Interior Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] mt-8 lg:mt-12">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-amber-100 to-gray-100">
                <Image
                  src="/assets/interior.jpg"
                  alt="Modern minimalist interior with natural lighting"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
              {/* Decorative border */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-gray-900/10 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="relative min-h-[550px] rounded-3xl overflow-hidden">

            {/* Glass overlay */}
            <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-md" />
            <div className="relative z-20 p-8">

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Phone Row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="relative">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
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
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-full text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${focusedField === 'fullName'
                          ? 'border-teal-500 shadow-lg shadow-teal-100'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
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
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-full text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${focusedField === 'phone'
                          ? 'border-teal-500 shadow-lg shadow-teal-100'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    />
                  </div>
                </div>

                {/* Email and Subject Row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
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
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-full text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${focusedField === 'email'
                          ? 'border-teal-500 shadow-lg shadow-teal-100'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    />
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
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
                      className={`w-full px-4 py-3.5 bg-white border-2 rounded-full text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none ${focusedField === 'subject'
                          ? 'border-teal-500 shadow-lg shadow-teal-100'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
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
                    rows={6}
                    className={`w-full px-4 py-3.5 bg-white border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none resize-none ${focusedField === 'message'
                        ? 'border-teal-500 shadow-lg shadow-teal-100'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:from-teal-700 hover:to-teal-800 overflow-hidden"
                  >
                    <span className="relative z-10 text-base md:text-lg">Envoyer Un Message</span>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              </form>
            </div>

            {/* Decorative floating element */}
            <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-2xl animate-pulse"></div>
          </div>
          {/* Right corner image */}
          <Image
            src="/assets/plann.png"
            alt="Project illustration"
            width={700}
            height={400}
            className="absolute -top-40 -right-10 w-60 h-60 lg:w-80 lg:h-[60rem] object-cover"
          />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30"></div>
    </section>
  );
};

export default ContactSection;