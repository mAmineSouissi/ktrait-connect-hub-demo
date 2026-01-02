import Image from "next/image";

export default function GalleryCollage() {
  return (
    <div className="relative overflow-hidden">
      {/* ================= BACKGROUND WORD ================= */}
      <div className="absolute inset-0 flex justify-center items-start pointer-events-none">
        <span className="text-[120px] md:text-[380px] font-cal-sans text-gray-200 opacity-80 leading-none">
          galerie
        </span>
      </div>

      {/* ================= IMAGE COLLAGE ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:mt-44">
        
        {/* Mobile / Tablet */}
        <div className="grid grid-cols-2 gap-4 md:hidden mb-20">
          <Image src="/assets/img11.png" alt="" width={400} height={500} className="rounded-3xl object-cover" />
          <Image src="/assets/img12.png" alt="" width={400} height={300} className="rounded-2xl object-cover" />
          <Image src="/assets/img13.png" alt="" width={400} height={450} className="rounded-2xl object-cover" />
          <Image src="/assets/img14.png" alt="" width={400} height={300} className="rounded-2xl object-cover" />
        </div>

        {/* Desktop */}
        <div className="hidden md:block relative h-[800px] mb-28">
          <div className="absolute top-0 left-[-15%] w-[480px] z-10">
            <Image src="/assets/img11.png" alt="" width={380} height={480} className="rounded-3xl w-full shadow-lg" />
          </div>

          <div className="absolute top-[20px] left-[25%] w-[480px] z-20">
            <Image src="/assets/img12.png" alt="" width={320} height={240} className="rounded-2xl w-full shadow-lg" />
          </div>

          <div className="absolute top-0 left-[795px] w-[590px] z-10">
            <Image src="/assets/img13.png" alt="" width={360} height={450} className="rounded-3xl w-full shadow-lg" />
          </div>

          <div className="absolute top-[320px] left-[2%] w-[300px] z-20">
            <Image src="/assets/img14.png" alt="" width={300} height={220} className="rounded-2xl w-full shadow-lg" />
          </div>

          <div className="absolute top-[350px] left-[30%] w-[490px] z-10">
            <Image src="/assets/img15.png" alt="" width={400} height={300} className="rounded-3xl w-full h-96 shadow-lg" />
          </div>

          <div className="absolute bottom-[100px] right-[90%] w-[340px] z-20">
            <Image src="/assets/img16.png" alt="" width={340} height={420} className="rounded-3xl w-full shadow-lg" />
          </div>

          <div className="absolute top-[400px] right-[-10%] w-[440px] z-20">
            <Image src="/assets/img16.png" alt="" width={340} height={420} className="rounded-3xl w-full shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
