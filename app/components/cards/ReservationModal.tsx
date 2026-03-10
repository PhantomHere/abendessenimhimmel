"use client";
import { useState } from "react";
import { Recipe } from "../../page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Recipe[];
  onSuccess: () => void;
}

export default function ReservationModal({ isOpen, onClose, cartItems, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | string | null>(null);

  if (!isOpen) return null;

  const airships = [
    { name: "Zeppelin Luxury", desc: "Langsam & majestätisch — Panorama-Rundblick über die Alpen", icon: "I" },
    { name: "Falcon Express", desc: "Moderne Hochaltitudinen-Küche — für Kenner der Extraklasse", icon: "II" },
    { name: "The Cloud Cruiser", desc: "Open-Deck Gartenerlebnis — Sterne unter freiem Himmel", icon: "III" },
  ];

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace("€", "")), 0);

  const handleFinalize = () => {
    alert(`Reservierung für ${selectedShip} erfolgreich bestätigt.`);
    onSuccess();
    setStep(1);
    onClose();
  };

  const stepLabels = ["Luftschiff", "Sitzplan", "Abschluss"];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-5xl max-h-[88vh] rounded-sm overflow-hidden flex shadow-[0_0_80px_rgba(0,0,0,0.8)]">

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Modal header with steps */}
          <div className="border-b border-[#c9a84c]/10 px-10 pt-8 pb-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-4 h-px bg-[#c9a84c]" />
              <span
                className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Reservierung
              </span>
              <button
                onClick={onClose}
                className="ml-auto text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* Step progress */}
            <div className="flex items-center gap-0">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step > i + 1 ? "opacity-50" : ""}`}>
                    <div
                      className={`w-6 h-6 flex items-center justify-center border text-[9px] transition-all duration-300 ${
                        step === i + 1
                          ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                          : step > i + 1
                          ? "border-[#c9a84c]/50 text-[#c9a84c]/50 bg-[#c9a84c]/5"
                          : "border-white/10 text-white/20"
                      }`}
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                        step === i + 1 ? "text-[#c9a84c]" : "text-white/20"
                      }`}
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div className={`w-12 h-px mx-3 transition-all duration-500 ${step > i + 1 ? "bg-[#c9a84c]/40" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-10">

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2
                  className="text-[#ede0c4] text-4xl font-light mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Wählen Sie Ihr <em className="italic text-[#c9a84c]">Luftschiff</em>
                </h2>
                <p
                  className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Drei einzigartige Erlebnisse — alle auf 3.000 Metern Höhe.
                </p>
                <div className="space-y-3">
                  {airships.map((ship) => (
                    <button
                      key={ship.name}
                      onClick={() => { setSelectedShip(ship.name); setStep(2); }}
                      className="w-full p-6 border border-white/8 hover:border-[#c9a84c]/60 transition-all duration-300 text-left group flex items-center gap-6 bg-white/[0.01] hover:bg-[#c9a84c]/5"
                    >
                      <span
                        className="text-[#c9a84c]/25 text-3xl group-hover:text-[#c9a84c]/60 transition-colors font-light w-8"
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {ship.icon}
                      </span>
                      <div>
                        <h3
                          className="text-[#ede0c4] text-xl font-light group-hover:text-[#c9a84c] transition-colors"
                          style={{ fontFamily: "var(--font-cormorant)" }}
                        >
                          {ship.name}
                        </h3>
                        <p
                          className="text-[#d4c5a0]/40 text-sm mt-1 font-light"
                          style={{ fontFamily: "var(--font-cormorant)" }}
                        >
                          {ship.desc}
                        </p>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-[#c9a84c]/0 group-hover:text-[#c9a84c]/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2
                  className="text-[#ede0c4] text-4xl font-light mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Sitzplan: <em className="italic text-[#c9a84c]">{selectedShip}</em>
                </h2>
                <p
                  className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Wählen Sie einen Tisch oder reservieren Sie das gesamte Schiff.
                </p>

                {/* Private charter */}
                <button
                  onClick={() => { setSelectedTable("Ganzes Schiff"); setStep(3); }}
                  className="w-full p-5 border border-[#c9a84c]/30 hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 transition-all duration-300 mb-6 group flex items-center justify-between"
                >
                  <div className="text-left">
                    <p
                      className="text-[#c9a84c] tracking-[0.2em] text-[10px] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      Privat-Charter
                    </p>
                    <p
                      className="text-[#ede0c4] text-xl font-light mt-1"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Gesamtes Schiff reservieren
                    </p>
                  </div>
                  <span
                    className="text-[#c9a84c]/50 text-sm tracking-[0.15em] uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    +500€
                  </span>
                </button>

                {/* Table grid */}
                <div
                  className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-4"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Einzeltische
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedTable(i + 1); setStep(3); }}
                      className="h-14 border border-white/10 hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/5 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-all duration-200 text-xs tracking-[0.15em] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="mt-6 text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.2em] uppercase flex items-center gap-2"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  ← Zurück
                </button>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2
                  className="text-[#ede0c4] text-4xl font-light mb-2"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Fast <em className="italic text-[#c9a84c]">fertig</em>
                </h2>
                <p
                  className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Bitte vervollständigen Sie Ihre Angaben.
                </p>

                {/* Summary card */}
                <div className="border border-[#c9a84c]/20 p-6 mb-6">
                  <div className="flex items-baseline justify-between mb-1">
                    <span
                      className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      Ihre Wahl
                    </span>
                  </div>
                  <p
                    className="text-[#ede0c4] text-xl font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {selectedShip}{" "}
                    <span className="text-[#c9a84c]/60">—</span>{" "}
                    {selectedTable === "Ganzes Schiff" ? "Privat-Charter" : `Tisch ${selectedTable}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label
                      className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      Flugdatum
                    </label>
                    <input
                      type="date"
                      className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] outline-none transition-colors"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      Passagier-Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ihr Name"
                      className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/20 outline-none transition-colors"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleFinalize}
                  className="w-full relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] py-5 text-[#c9a84c] hover:text-[#0d0c0a] tracking-[0.25em] text-[10px] uppercase overflow-hidden transition-all duration-500"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <span className="relative">
                    Bestätigen & Bezahlen — {selectedTable === "Ganzes Schiff" ? total + 500 : total}€
                  </span>
                </button>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-3 text-center text-[#d4c5a0]/25 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  ← Sitzplan ändern
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order sidebar */}
        <div className="w-72 border-l border-[#c9a84c]/10 bg-black/20 flex flex-col">
          <div className="p-7 border-b border-[#c9a84c]/10">
            <span
              className="text-[#c9a84c]/50 tracking-[0.35em] text-[9px] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Ihre Bestellung
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-7 space-y-5">
            {cartItems.length === 0 ? (
              <p
                className="text-[#d4c5a0]/25 text-lg italic"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Noch keine Speisen gewählt.
              </p>
            ) : (
              cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <span
                    className="text-[#d4c5a0]/60 text-base font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="text-[#c9a84c]/70 text-xs tracking-[0.1em]"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {item.price}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-7 border-t border-[#c9a84c]/10">
            <div className="flex justify-between items-baseline">
              <span
                className="text-[#c9a84c]/50 tracking-[0.2em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Total
              </span>
              <span
                className="text-[#ede0c4] text-2xl font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {total}€
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
