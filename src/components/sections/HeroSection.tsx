import React from 'react';
import Image from 'next/image';

export const HeroSection = () => {
  return (
    <section className="relative h-[60vh] md:h-[50vh] w-full overflow-hidden">
      <Image
        src="/hero_sec_img.png" // Placeholder image
        alt="PLRA Shooter"
        layout="fill"
        objectFit="cover"
        quality={90}
        className="z-0"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center z-10">
        <div className="p-4">
          <h2 className="text-plra-gold text-2xl md:text-4xl font-bold mb-2 uppercase">Welcome to the</h2>
          <h1 className="text-plra-white text-4xl md:text-7xl font-extrabold tracking-wide leading-tight">
            PAKISTAN LONG RANGE RIFLE ASSOCIATION
          </h1>
        </div>
      </div>
    </section>
  );
};