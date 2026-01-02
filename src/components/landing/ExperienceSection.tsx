"use client";

import Image from "next/image";
import ClientVIP from "./ClientVIP";

export default function ExperienceSection() {
  return (
    <section className="w-full flex flex-col items-center px-4 md:px-16 lg:px-32 py-12 bg-white lg:mt-36">
      {/* Top Hero House Image */}
      <div className="w-full max-w-[1400px] mb-12 relative">
        {/* Background Text */}
        <span className="absolute inset-0 flex justify-center items-center text-gray-400 font-cal-sans font-bold text-6xl md:text-8xl lg:text-[15rem] leading-none tracking-widest transform scale-x-125 opacity-20 -translate-y-1/2 pointer-events-none select-none">
          ktrait
        </span>

        {/* Hero Image */}
        <Image
          src="/assets/hero-house.png"
          alt="Modern House"
          width={1400}
          height={200}
          className="w-full h-auto object-cover relative z-10"
        />
      </div>

      {/* Client VIP Section */}
      <ClientVIP />

      <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
        {/* Green circle inside */}
        <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2"></span>

        {/* Text */}
        <span className="text-[10px] md:text-xs lg:text-bold font-bold font-cal-sans text-black tracking-wider uppercase">
          panoramas à 360 degrés{" "}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 mt-9">
        Créez Une Expérience <br />
        <span className="text-teal-600">Encore Plus Grande</span>
      </h2>

      {/* Interior Living Room Image */}
      <div className="w-full max-w-[1200px]">
        <Image
          src="/assets/living-room.png"
          alt="Living Room Interior"
          width={1200}
          height={600}
          className="w-full h-auto rounded-xl shadow-xl"
        />
      </div>
    </section>
  );
}
