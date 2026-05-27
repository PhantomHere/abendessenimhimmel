"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "app/lib/supabase/client";

interface MainMenuProps {
  onOpenReservation: () => void;
  onOpenAccount: () => void;
}

export default function Main_Menu({ onOpenReservation, onOpenAccount }: MainMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { name: "Speisekarte", href: "#menu" },
    { name: "Über Uns", href: "#about" },
    { name: "Kontakt", href: "#contact" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1], // Proper cubic-bezier instead of string
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative bg-[#0d0c0a] border-b border-[#c9a84c]/10"
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between py-4">

        {/* Left nav links */}
        <ul className="flex items-center gap-12">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <a
                href={item.href}
                className="relative text-[#d4c5a0]/70 hover:text-[#c9a84c] transition-colors duration-300 tracking-[0.2em] text-xs uppercase group"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {item.name}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px bg-[#c9a84c]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Account button */}
          <motion.button
            onClick={onOpenAccount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-2 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-colors duration-300 group"
            title={isLoggedIn ? "Mein Konto" : "Anmelden"}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>

            {isLoggedIn && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#c9a84c]"
              />
            )}

            <span
              className="text-[9px] uppercase tracking-[0.2em] hidden md:block"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {isLoggedIn ? "Konto" : "Anmelden"}
            </span>
          </motion.button>

          {/* Divider */}
          <div className="w-px h-4 bg-[#c9a84c]/20" />

          {/* Reservation CTA */}
          <motion.button
            onClick={onOpenReservation}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] px-8 py-2.5 text-[#c9a84c] hover:text-[#0d0c0a] transition-all duration-500 tracking-[0.25em] text-xs uppercase overflow-hidden"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <motion.span
              className="absolute inset-0 bg-[#c9a84c]"
              initial={{ translateY: "100%" }}
              whileHover={{ translateY: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <span className="relative z-10">Reservierung</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}