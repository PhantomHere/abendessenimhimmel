import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroImage() {
  return (
    <section className="relative w-full h-[85vh] sm:h-[92vh] overflow-hidden">
      
      {/* Background Image with subtle zoom */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/imgs/hero-restaurant.jpg"
          alt="Aetheria Dining"
          fill
          className="object-cover"
          priority
          style={{ transformOrigin: "center center" }}
        />
      </motion.div>

      {/* Multi-layer atmosphere overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/30 to-[#0d0c0a]/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/60 via-transparent to-[#0d0c0a]/20" />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end px-6 sm:px-16 pb-14 sm:pb-20 max-w-7xl">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "48px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-px bg-[#c9a84c]"
          />
          <span
            className="text-[#c9a84c]/80 tracking-[0.3em] sm:tracking-[0.45em] text-[9px] sm:text-[10px] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Haute Cuisine über den Wolken
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          className="text-[#ede0c4] text-5xl sm:text-7xl md:text-8xl leading-[0.9] mb-4 sm:mb-6 font-light"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Willkommen
          <br />
          <motion.em
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="font-light italic text-[#c9a84c]"
          >
            im Genuss
          </motion.em>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
          className="text-[#d4c5a0]/60 text-base sm:text-xl font-light max-w-lg leading-relaxed mb-8 sm:mb-10"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Traditionelle Küche trifft auf moderne Eleganz — in 3.000 Metern Höhe,
          lautlos über den schönsten Landschaften Europas.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{ height: [40, 55, 40] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-gradient-to-b from-[#c9a84c] to-transparent"
          />
          <span
            className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Entdecken
          </span>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0d0c0a] to-transparent" />
    </section>
  );
}