"use client";

import Image from "next/image";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="relative bg-white overflow-hidden py-16 md:py-24">
      
      {/* ================= NEWSLETTER ================= */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-4 md:px-6 py-1.5 md:py-2 border border-gray-300 rounded-full">
          <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#006D64] rounded-full mr-2" />
          <span className="text-[10px] md:text-xs font-bold font-cal-sans uppercase">
            Abonnez-vous à la newsletter
          </span>
        </div>

<h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cal-sans mt-10 text-center leading-snug">
  <span className="capitalize block">
    Inscrivez Vous À Notre Newsletter
  </span>
  <span className="capitalize text-primary block">
    Pour Rester Informé
  </span>
</h2>


<p className="text-gray-800 font-thin mx-auto mb-10 text-center text-sm md:text-base lg:text-base leading-relaxed max-w-[600px]">
  <span className="block">
    Inscrivez-vous à notre newsletter. Apprenez de nouvelles choses, accédez à du contenu  exclusif et restez informé des dernières actualités du secteur.

  </span>
 
</p>





        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="w-full bg-transparent border-b-2 border-gray-300 py-4 pr-12 text-black placeholder-gray-400 focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 -translate-y-1/2 text-primary transition hover:translate-x-1"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 14h18M17 6l6 8-6 8" />
            </svg>
          </button>
        </form>
      </div>

      {/* ================= PLAN IMAGES ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <Image src="/assets/plan-left.png" alt="" width={500} height={500} className="absolute bottom-0 left-0 hidden md:block" />
        <Image src="/assets/plan-right.png" alt="" width={500} height={500} className="absolute bottom-0 right-0 hidden md:block" />
      </div>
    </section>
  );
}
