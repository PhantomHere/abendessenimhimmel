import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header_logo() {
  return (
    <header className="relative bg-[#0d0c0a] border-b border-[#c9a84c]/20 overflow-hidden">
      {/* Top gold rule - animated width */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent origin-left"
      />

      <div className="container mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col items-center gap-1">
        
        {/* Overline - "Since 1923" */}
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-[#c9a84c]/60 tracking-[0.4em] text-[8px] sm:text-[9px] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Since 1923
        </motion.span>

        {/* Logo - subtle scale + fade in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
        >
          <Link href="/" className="block">
            <Image
              src="/imgs/logo.svg"
              alt="Aetheria Dining"
              width={180}
              height={60}
              priority
              className="h-14 sm:h-20 w-auto brightness-110 contrast-110"
            />
          </Link>
        </motion.div>

        {/* Underline label - "Haute Cuisine · 3.000m" */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="text-[#c9a84c]/40 tracking-[0.4em] sm:tracking-[0.6em] text-[7px] sm:text-[8px] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Haute Cuisine · 3.000m
        </motion.span>
      </div>

      {/* Bottom gold rule - animated width */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent origin-right"
      />
    </header>
  );
}