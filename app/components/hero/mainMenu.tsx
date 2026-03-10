"use client";

interface MainMenuProps {
  onOpenReservation: () => void;
}

export default function Main_Menu({ onOpenReservation }: MainMenuProps) {
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

        {/* Reservation CTA - right side */}
        <button
          onClick={onOpenReservation}
          className="relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] px-8 py-2.5 text-[#c9a84c] hover:text-[#0d0c0a] transition-all duration-500 tracking-[0.25em] text-xs uppercase overflow-hidden"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-in-out" />
          <span className="relative">Reservierung</span>
        </button>
      </div>
    </nav>
  );
}
