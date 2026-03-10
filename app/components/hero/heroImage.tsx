import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="relative w-full h-[90vh] md:h-[100vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/imgs/hero-restaurant.jpg"
          alt="Aetheria Sky Dining"
          fill
          className="object-cover brightness-[0.65] contrast-[1.05]"
          priority
          quality={85}
          placeholder="blur"
        />
      </div>
      
      {/* Stronger vignette + gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-end items-center md:items-start px-6 md:px-16 lg:px-32 pb-20 md:pb-32 text-center md:text-left">
        <div className="w-20 h-0.5 bg-[var(--color-gold)] mb-6 animate-pulse-slow" />
        
        <h1 className="text-[var(--color-gold)] text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-none mb-4">
          Aetheria Sky
        </h1>
        <p className="text-[var(--color-cream)] text-xl md:text-2xl lg:text-3xl font-light max-w-3xl">
          Haute Cuisine • 3.000 Meter Höhe • Unvergessliche Ausblicke
        </p>
      </div>
    </div>
  );
}