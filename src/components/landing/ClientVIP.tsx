'use client';

import Image from 'next/image';
const icons = [
  { id: 1, src: "/assets/company.png", alt: "Company" },
  { id: 2, src: "/assets/modern.png", alt: "Modern" },
  { id: 3, src: "/assets/studio.png", alt: "Studio" },
  { id: 4, src: "/assets/design.png", alt: "Design" },
  { id: 5, src: "/assets/company-triangle.png", alt: "Company Triangle" },
  { id: 6, src: "/assets/minimal.png", alt: "Minimal" },
];

export default function ClientVIP() {
  return (
    <div className="mb-16 w-full">
      {/* Line with CLIENT VIP */}
      <div className="flex items-center mb-8 px-6 md:px-12 lg:px-20">
        <div className="flex-grow border-t-2 border-gray-300" />
        <span className="mx-6 text-black font-bold text-lg md:text-lg">
          CLIENT VIP
        </span>
        <div className="flex-grow border-t-2 border-gray-300" />
      </div>

      {/* Icons */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center rounded-lg hover:shadow-lg transition"
          >
            <Image
              src={icon.src}
              alt={icon.alt}
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
