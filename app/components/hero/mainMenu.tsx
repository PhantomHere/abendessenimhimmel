"use client";
import { useEffect, useState } from "react";
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

    // Listen for auth changes (login/logout)
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

  return (
    <nav className="relative bg-[#0d0c0a] border-b border-[#c9a84c]/10">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between py-4">

        {/* Left nav links */}
        <ul className="flex items-center gap-12">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="relative text-[#d4c5a0]/70 hover:text-[#c9a84c] transition-colors duration-300 tracking-[0.2em] text-xs uppercase group"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-400" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* Account button */}
          <button
            onClick={onOpenAccount}
            className="relative flex items-center gap-2 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-colors duration-300 group"
            title={isLoggedIn ? "Mein Konto" : "Anmelden"}
          >
            {/* Person icon */}
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>

            {/* Gold dot when logged in */}
            {isLoggedIn && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#c9a84c]" />
            )}

            <span
              className="text-[9px] uppercase tracking-[0.2em] hidden md:block"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {isLoggedIn ? "Konto" : "Anmelden"}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-4 bg-[#c9a84c]/20" />

          {/* Reservation CTA */}
          <button
            onClick={onOpenReservation}
            className="relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] px-8 py-2.5 text-[#c9a84c] hover:text-[#0d0c0a] transition-all duration-500 tracking-[0.25em] text-xs uppercase overflow-hidden"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-in-out" />
            <span className="relative">Reservierung</span>
          </button>
        </div>
      </div>
    </nav>
  );
}