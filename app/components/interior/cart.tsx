"use client";
import { useState } from "react";
import { Recipe } from "../../page";

interface CartProps {
  items: Recipe[];
  onRemove: (title: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onRemove, onCheckout }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const existing = acc.find((i) => i.title === item.title);
    if (existing) { existing.quantity += 1; }
    else { acc.push({ ...item, quantity: 1 }); }
    return acc;
  }, [] as (Recipe & { quantity: number })[]);

  const total = items.reduce((sum: number, item: Recipe) => {
    const priceNum = parseFloat(item.price.replace("€", ""));
    return isNaN(priceNum) ? sum : sum + priceNum;
  }, 0);

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 group flex items-center gap-2 sm:gap-3 bg-[#0d0c0a] border border-[#c9a84c]/50 hover:border-[#c9a84c] px-4 sm:px-5 py-3 sm:py-3.5 transition-all duration-300 shadow-2xl"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <span
          className="text-[#c9a84c] tracking-[0.2em] text-[10px] uppercase hidden sm:inline"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Auswahl
        </span>
        {items.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#c9a84c] text-[#0d0c0a] text-[10px] font-bold">
            {items.length}
          </span>
        )}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Full-width on mobile, fixed width on larger screens */}
          <div className="relative w-full sm:w-96 h-full bg-[#0d0c0a] border-l border-[#c9a84c]/20 flex flex-col shadow-2xl">

            {/* Drawer header */}
            <div className="p-6 sm:p-8 border-b border-[#c9a84c]/10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-4 h-px bg-[#c9a84c]" />
                  <span
                    className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Ihre Auswahl
                  </span>
                </div>
                <h2
                  className="text-[#ede0c4] text-2xl sm:text-3xl font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Menü Zusammenstellung
                </h2>
              </div>
              {/* Close button — visible on mobile */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors text-xl mt-1 sm:hidden"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5">
              {groupedItems.length === 0 ? (
                <p
                  className="text-[#d4c5a0]/30 text-lg italic"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Ihr Menü ist noch leer.
                </p>
              ) : (
                groupedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-5 border-b border-[#c9a84c]/10 last:border-0">
                    <div>
                      <p
                        className="text-[#ede0c4] text-lg font-light"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {item.title}
                        {item.quantity > 1 && (
                          <span className="text-[#c9a84c]/60 ml-2 text-sm">×{item.quantity}</span>
                        )}
                      </p>
                      <p
                        className="text-[#c9a84c] tracking-[0.15em] text-[10px] uppercase mt-1"
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {item.price}
                      </p>
                    </div>
                    {/* Always visible remove on mobile (no hover needed) */}
                    <button
                      onClick={() => onRemove(item.title)}
                      className="text-[#d4c5a0]/30 hover:text-red-400 active:text-red-400 transition-colors text-base mt-1 p-1"
                      aria-label={`${item.title} entfernen`}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 sm:p-8 border-t border-[#c9a84c]/10">
              <div className="flex justify-between items-baseline mb-5 sm:mb-6">
                <span
                  className="text-[#c9a84c]/60 tracking-[0.25em] text-[10px] uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Gesamtbetrag
                </span>
                <span
                  className="text-[#ede0c4] text-3xl font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {total}€
                </span>
              </div>
              <button
                onClick={() => { setIsOpen(false); onCheckout(); }}
                className="w-full relative group/btn border border-[#c9a84c]/60 hover:border-[#c9a84c] py-4 text-[#c9a84c] hover:text-[#0d0c0a] transition-all duration-500 tracking-[0.2em] text-[10px] uppercase overflow-hidden"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-400" />
                <span className="relative">Zur Reservierung</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}