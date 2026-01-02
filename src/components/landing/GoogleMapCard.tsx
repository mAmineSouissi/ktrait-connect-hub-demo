"use client";

import React from "react";

const GoogleMapCard: React.FC = () => {
  return (
    <div className="relative w-full mt-16 md:mt-24">
      <div
        className="
          mx-auto
          px-4 sm:px-6
          lg:px-0
          max-w-7xl
          xl:max-w-[1600px]
          2xl:max-w-[2000px]
        "
      >
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white">
  

          {/* Map */}
          <div
            className="
              relative w-full
              h-[260px]
              sm:h-[320px]
              md:h-[420px]
              lg:h-[560px]
              xl:h-[620px]
              2xl:h-[700px]
            "
          >
            <iframe
              title="Google Maps - Ben Arous"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.6983313755486!2d10.308983675641816!3d36.729805672267275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd4905c227596b%3A0xba62f54e043ac2cd!2sRue%20des%20Oliviers%2C%20Bou%20Mhel%20el-Bassatine!5e0!3m2!1sfr!2stn!4v1767150944436!5m2!1sfr!2stn"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapCard;
