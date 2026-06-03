"use client";

import { motion } from "framer-motion";

export default function AboutUs() {
  const stats = [
    { label: "Flughöhe", value: "3.000m", roman: "I" },
    { label: "Flotte", value: "3 Schiffe", roman: "II" },
    { label: "Michelin-Sterne", value: "2", roman: "III" },
    { label: "Gegründet", value: "1923", roman: "IV" },
  ];

  // Animation Variants - Fixed types
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1] as const, // Proper cubic-bezier
      },
    },
  };

  const statVariant = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1] as const 
      },
    },
  };

  return (
    <section id="about" className="py-20 sm:py-32 bg-[#0d0c0a] relative overflow-hidden">
      {/* Decorative background numeral */}
      <motion.div
        initial={{ opacity: 0.03, y: -20 }}
        animate={{ 
          opacity: 0.03, 
          y: [-20, 20, -20] 
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#c9a84c]/[0.03] text-[14rem] sm:text-[28rem] font-black leading-none select-none pointer-events-none -mr-10 sm:-mr-24"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        AD
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        {/* Section label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 mb-10 sm:mb-16"
        >
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 32 }}
            transition={{ duration: 0.8 }}
            className="h-px bg-[#c9a84c]" 
          />
          <span
            className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Unsere Geschichte
          </span>
          <div className="flex-1 h-px bg-[#c9a84c]/10" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-24 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={itemVariant}
              className="text-[#ede0c4] text-5xl sm:text-6xl md:text-7xl font-light leading-[1.05] mb-8 sm:mb-10"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Kulinarik über
              <br />
              <em className="italic text-[#c9a84c]">den Wolken</em>
              <br />
              seit Generationen
            </motion.h2>

            <motion.div 
              variants={containerVariant}
              className="space-y-5 mb-10 sm:mb-12"
            >
              <motion.p
                variants={itemVariant}
                className="text-[#d4c5a0]/70 text-lg sm:text-xl leading-relaxed font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Willkommen an Bord der exklusivsten Restaurant-Flotte der Welt.
                Unsere Geschichte begann mit der Vision, die Eleganz der klassischen
                Luftschifffahrt mit moderner Haute Cuisine zu verbinden.
              </motion.p>
              <motion.p
                variants={itemVariant}
                className="text-[#d4c5a0]/50 text-base sm:text-lg leading-relaxed font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                In unseren Gondeln erleben Sie nicht nur ein Menü, sondern eine Reise
                durch die Atmosphäre. Jedes Gericht wird in unserer Bordküche frisch
                zubereitet, während Sie lautlos über die schönsten Landschaften Europas gleiten.
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={containerVariant}
              className="grid grid-cols-2 gap-0 border-t border-[#c9a84c]/20"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={statVariant}
                  whileHover={{ 
                    backgroundColor: "rgba(201, 168, 76, 0.05)",
                  }}
                  className={`py-5 sm:py-7 pr-4 sm:pr-8 group ${i % 2 === 0 ? "border-r border-[#c9a84c]/20" : "pl-4 sm:pl-8"} ${i < 2 ? "border-b border-[#c9a84c]/20" : ""}`}
                >
                  <p
                    className="text-[#c9a84c]/30 text-xs mb-1 transition-colors group-hover:text-[#c9a84c]/50"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {stat.roman}
                  </p>
                  <p
                    className="text-[#ede0c4] text-2xl sm:text-3xl font-light mb-1"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[#c9a84c]/60 tracking-[0.2em] sm:tracking-[0.25em] text-[8px] sm:text-[9px] uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative hidden sm:block"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute -inset-5 border border-[#c9a84c]/15 rounded-sm" 
            />
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -inset-2 border border-[#c9a84c]/08 rounded-sm" 
            />

            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-sm">
              <motion.img
                src="/imgs/airship-interior.jpg"
                alt="Airship Interior"
                className="w-full h-full object-cover opacity-75"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/30 to-transparent" />

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: 32 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="w-8 h-px bg-[#c9a84c] mb-4" 
                />
                <p
                  className="text-[#ede0c4]/90 text-xl sm:text-2xl font-light italic leading-relaxed"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  „Der Himmel ist kein Ort,
                  <br />
                  sondern ein Erlebnis."
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}