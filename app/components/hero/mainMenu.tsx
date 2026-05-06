"use client";
import { useEffect, useState } from "react";
import { createClient } from "app/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface MainMenuProps {
  onOpenReservation: () => void;
  onOpenAccount: () => void;
}

export default function Main_Menu({ onOpenReservation, onOpenAccount }: MainMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    // Scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Speisekarte", href: "#menu" },
    { name: "Über Uns", href: "#about" },
    { name: "Kontakt", href: "#contact" },
  ];

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0d0c0a] border-b transition-all duration-500 ${
        scrolled 
          ? "border-[#c9a84c]/30 py-3 shadow-2xl shadow-black/80" 
          : "border-[#c9a84c]/10 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        
        {/* Left nav links */}
        <motion.ul 
          className="flex items-center gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navItems.map((item, index) => (
            <motion.li key={item.name} variants={itemVariants}>
              <a
                href={item.href}
                className="relative text-[#d4c5a0]/70 hover:text-[#c9a84c] transition-colors duration-300 tracking-[0.2em] text-xs uppercase group overflow-hidden"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {item.name}
                
                {/* Underline with shine effect */}
                <span className="absolute -bottom-1 left-0 w-full h-px bg-[#c9a84c]/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-700 origin-left" />
                
                {/* Subtle shine on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          
          {/* Account button */}
          <motion.button
            onClick={onOpenAccount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-colors duration-300 group px-3 py-2 rounded-xl"
            title={isLoggedIn ? "Mein Konto" : "Anmelden"}
          >
            <motion.div
              animate={{ 
                rotate: isLoggedIn ? [0, 15, -15, 0] : 0 
              }}
              transition={{ duration: 0.4 }}
            >
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </motion.div>

            <AnimatePresence>
              {isLoggedIn && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#c9a84c] ring-2 ring-[#0d0c0a]"
                />
              )}
            </AnimatePresence>

            <span
              className="text-[9px] uppercase tracking-[0.2em] hidden md:block"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {isLoggedIn ? "Konto" : "Anmelden"}
            </span>
          </motion.button>

          {/* Divider with fade */}
          <motion.div 
            className="w-px h-5 bg-[#c9a84c]/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "1.25rem" }}
            transition={{ delay: 0.4 }}
          />

          {/* Reservation CTA - Premium button */}
          <motion.button
            onClick={onOpenReservation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] px-9 py-3 text-[#c9a84c] hover:text-[#0d0c0a] transition-all tracking-[0.25em] text-xs uppercase overflow-hidden rounded-xl font-medium"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {/* Background fill */}
            <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            
            {/* Shine layer */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-[200%] transition-all duration-700" />
            
            <span className="relative z-10 flex items-center gap-2">
              Reservierung
              <motion.span
                animate={{ rotate: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 3 }}
                className="inline-block"
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}