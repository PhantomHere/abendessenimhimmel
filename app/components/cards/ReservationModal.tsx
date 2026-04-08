"use client";
import { useState } from "react";
import { createClient } from "app/lib/supabase/client"
import { Recipe } from "../../page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Recipe[];
  onSuccess: () => void;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function ReservationModal({ isOpen, onClose, cartItems, onSuccess }: Props) {
  const [step, setStep] = useState(1);
  const [selectedShip, setSelectedShip] = useState("");
  const [selectedTable, setSelectedTable] = useState<number | string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const airships = [
    { name: "Zeppelin Luxury", desc: "Langsam & majestätisch — Panorama-Rundblick über die Alpen", icon: "I" },
    { name: "Falcon Express", desc: "Moderne Hochaltitudinen-Küche — für Kenner der Extraklasse", icon: "II" },
    { name: "The Cloud Cruiser", desc: "Open-Deck Gartenerlebnis — Sterne unter freiem Himmel", icon: "III" },
  ];

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace("€", "")), 0);
  const finalTotal = selectedTable === "Ganzes Schiff" ? total + 500 : total;

  const handleClose = () => {
    setStep(1);
    setSelectedShip("");
    setSelectedTable(null);
    setGuestName("");
    setFlightDate("");
    setSubmitState("idle");
    setErrorMsg("");
    onClose();
  };

  const handleFinalize = async () => {
    if (!guestName.trim()) { setErrorMsg("Bitte geben Sie Ihren Namen ein."); return; }
    if (!flightDate) { setErrorMsg("Bitte wählen Sie ein Flugdatum."); return; }
    setErrorMsg("");
    setSubmitState("loading");

    const supabase = createClient();

    const { error } = await supabase.from("reservations").insert({
      guest_name: guestName.trim(),
      flight_date: flightDate,
      airship: selectedShip,
      table_selection: selectedTable === "Ganzes Schiff" ? "Ganzes Schiff" : `Tisch ${selectedTable}`,
      order_items: cartItems.map((item) => ({ title: item.title, price: item.price })),
      order_total: finalTotal,
    });

    if (error) {
      console.error("Reservation error:", error);
      setErrorMsg("Reservierung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.");
      setSubmitState("error");
      return;
    }

    setSubmitState("success");
    onSuccess();
  };

  const stepLabels = ["Luftschiff", "Sitzplan", "Abschluss"];

  // ── Success screen ──────────────────────────────────────────────
  if (submitState === "success") {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleClose} />
        <div className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-md p-8 sm:p-12 rounded-sm text-center shadow-2xl">

          {/* Gold ring */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 border border-[#c9a84c]/40 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-6 h-px bg-[#c9a84c]" />
            <span className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Bestätigt
            </span>
            <div className="w-6 h-px bg-[#c9a84c]" />
          </div>

          <h2 className="text-[#ede0c4] text-3xl sm:text-4xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
            Guten Flug,
            <br />
            <em className="italic text-[#c9a84c]">{guestName}</em>
          </h2>
          <p className="text-[#d4c5a0]/40 text-base sm:text-lg font-light mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
            {selectedShip} — {selectedTable === "Ganzes Schiff" ? "Privat-Charter" : `Tisch ${selectedTable}`}
          </p>
          <p className="text-[#d4c5a0]/30 text-sm sm:text-base font-light mb-8 sm:mb-10" style={{ fontFamily: "var(--font-cormorant)" }}>
            {new Date(flightDate).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
          </p>

          <button
            onClick={handleClose}
            className="w-full border border-[#c9a84c]/40 hover:border-[#c9a84c] py-4 text-[#c9a84c] tracking-[0.25em] text-[10px] uppercase transition-all duration-300"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Schließen
          </button>
        </div>
      </div>
    );
  }

  // ── Main modal ──────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleClose} />

      {/* 
        Mobile: bottom sheet (full width, slides up from bottom)
        Desktop: centered modal with sidebar
      */}
      <div className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full sm:max-w-5xl rounded-t-sm sm:rounded-sm overflow-hidden flex flex-col sm:flex-row shadow-[0_0_80px_rgba(0,0,0,0.8)] max-h-[92vh] sm:max-h-[88vh]">

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="border-b border-[#c9a84c]/10 px-5 sm:px-10 pt-6 sm:pt-8 pb-4 sm:pb-6">
            <div className="flex items-center gap-4 mb-4 sm:mb-5">
              <div className="w-4 h-px bg-[#c9a84c]" />
              <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                Reservierung
              </span>
              <button onClick={handleClose} className="ml-auto text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors text-lg">✕</button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-0">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className={`flex items-center gap-1.5 sm:gap-2 ${step > i + 1 ? "opacity-50" : ""}`}>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border text-[9px] transition-all duration-300 ${
                        step === i + 1 ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                        : step > i + 1 ? "border-[#c9a84c]/50 text-[#c9a84c]/50 bg-[#c9a84c]/5"
                        : "border-white/10 text-white/20"
                      }`}
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-colors hidden xs:inline ${
                        step === i + 1 ? "text-[#c9a84c]" : "text-white/20"
                      }`}
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`w-8 sm:w-16 h-px mx-2 sm:mx-4 ${step > i + 1 ? "bg-[#c9a84c]/30" : "bg-white/5"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content — scrollable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-10">

            {/* STEP 1 — Airship selection */}
            {step === 1 && (
              <div>
                <h2 className="text-[#ede0c4] text-3xl sm:text-4xl font-light mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Wählen Sie Ihr <em className="italic text-[#c9a84c]">Luftschiff</em>
                </h2>
                <p className="text-[#d4c5a0]/40 mb-6 sm:mb-8 text-base sm:text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Drei Erlebnisse. Eine Reise über den Wolken.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {airships.map((ship) => (
                    <button
                      key={ship.name}
                      onClick={() => { setSelectedShip(ship.name); setStep(2); }}
                      className="w-full p-4 sm:p-6 border border-white/8 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 transition-all duration-300 text-left group flex items-center gap-4 sm:gap-6 active:border-[#c9a84c]/40 active:bg-[#c9a84c]/5"
                    >
                      <div
                        className="text-[#c9a84c]/20 text-3xl sm:text-4xl font-light flex-shrink-0 group-hover:text-[#c9a84c]/40 transition-colors"
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {ship.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#ede0c4] text-lg sm:text-xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {ship.name}
                        </p>
                        <p className="text-[#d4c5a0]/40 text-xs sm:text-sm leading-relaxed mt-1 font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                          {ship.desc}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-[#c9a84c]/30 group-hover:text-[#c9a84c]/60 flex-shrink-0 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Table selection */}
            {step === 2 && (
              <div>
                <h2 className="text-[#ede0c4] text-3xl sm:text-4xl font-light mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Sitzplan: <em className="italic text-[#c9a84c]">{selectedShip}</em>
                </h2>
                <p className="text-[#d4c5a0]/40 mb-6 sm:mb-8 text-base sm:text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Wählen Sie einen Tisch oder reservieren Sie das gesamte Schiff.
                </p>

                <button
                  onClick={() => { setSelectedTable("Ganzes Schiff"); setStep(3); }}
                  className="w-full p-4 sm:p-5 border border-[#c9a84c]/30 hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 active:border-[#c9a84c] active:bg-[#c9a84c]/5 transition-all duration-300 mb-5 sm:mb-6 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-[#c9a84c] tracking-[0.2em] text-[10px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>Privat-Charter</p>
                    <p className="text-[#ede0c4] text-lg sm:text-xl font-light mt-1" style={{ fontFamily: "var(--font-cormorant)" }}>Gesamtes Schiff reservieren</p>
                  </div>
                  <span className="text-[#c9a84c]/50 text-sm tracking-[0.15em] uppercase flex-shrink-0 ml-4" style={{ fontFamily: "var(--font-cinzel)" }}>+500€</span>
                </button>

                <div className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-3 sm:mb-4" style={{ fontFamily: "var(--font-cinzel)" }}>Einzeltische</div>
                {/* 4 cols on desktop, 3 on mobile */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[...Array(12)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedTable(i + 1); setStep(3); }}
                      className="h-12 sm:h-14 border border-white/10 hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/5 active:border-[#c9a84c]/60 active:bg-[#c9a84c]/5 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-all duration-200 text-xs tracking-[0.15em] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button onClick={() => setStep(1)} className="mt-5 sm:mt-6 text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.2em] uppercase flex items-center gap-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                  ← Zurück
                </button>
              </div>
            )}

            {/* STEP 3 — Final details */}
            {step === 3 && (
              <div>
                <h2 className="text-[#ede0c4] text-3xl sm:text-4xl font-light mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Fast <em className="italic text-[#c9a84c]">fertig</em>
                </h2>
                <p className="text-[#d4c5a0]/40 mb-6 sm:mb-8 text-base sm:text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Bitte vervollständigen Sie Ihre Angaben.
                </p>

                {/* Summary */}
                <div className="border border-[#c9a84c]/20 p-4 sm:p-6 mb-5 sm:mb-6">
                  <span className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>Ihre Wahl</span>
                  <p className="text-[#ede0c4] text-lg sm:text-xl font-light mt-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {selectedShip} <span className="text-[#c9a84c]/60">—</span> {selectedTable === "Ganzes Schiff" ? "Privat-Charter" : `Tisch ${selectedTable}`}
                  </p>
                </div>

                {/* Stack vertically on mobile, 2-col on sm+ */}
                <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 mb-5 sm:mb-6">
                  <div>
                    <label className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Flugdatum
                    </label>
                    <input
                      type="date"
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] outline-none transition-colors"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Passagier-Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ihr Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/20 outline-none transition-colors"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                </div>

                {/* Error message */}
                {errorMsg && (
                  <p className="text-red-400/70 text-base font-light mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {errorMsg}
                  </p>
                )}

                <button
                  onClick={handleFinalize}
                  disabled={submitState === "loading"}
                  className="w-full relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] py-4 sm:py-5 text-[#c9a84c] hover:text-[#0d0c0a] tracking-[0.2em] text-[10px] uppercase overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <span className="relative">
                    {submitState === "loading"
                      ? "Wird gespeichert..."
                      : `Bestätigen & Bezahlen — ${finalTotal}€`}
                  </span>
                </button>

                <button onClick={() => setStep(2)} className="w-full mt-3 text-center text-[#d4c5a0]/25 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.2em] uppercase py-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                  ← Sitzplan ändern
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order sidebar — hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex w-72 border-l border-[#c9a84c]/10 bg-black/20 flex-col">
          <div className="p-7 border-b border-[#c9a84c]/10">
            <span className="text-[#c9a84c]/50 tracking-[0.35em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Ihre Bestellung
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-7 space-y-5">
            {cartItems.length === 0 ? (
              <p className="text-[#d4c5a0]/25 text-lg italic" style={{ fontFamily: "var(--font-cormorant)" }}>
                Noch keine Speisen gewählt.
              </p>
            ) : (
              cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <span className="text-[#d4c5a0]/60 text-base font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</span>
                  <span className="text-[#c9a84c]/70 text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-cinzel)" }}>{item.price}</span>
                </div>
              ))
            )}
          </div>
          <div className="p-7 border-t border-[#c9a84c]/10">
            <div className="flex justify-between items-baseline">
              <span className="text-[#c9a84c]/50 tracking-[0.2em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>Total</span>
              <span className="text-[#ede0c4] text-2xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{finalTotal}€</span>
            </div>
          </div>
        </div>

        {/* Mobile order summary bar — shown inside step 3 only via inline, or as sticky footer */}
        {cartItems.length > 0 && (
          <div className="sm:hidden border-t border-[#c9a84c]/10 px-5 py-3 flex justify-between items-center bg-black/30">
            <span className="text-[#c9a84c]/50 tracking-[0.25em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              {cartItems.length} {cartItems.length === 1 ? "Gericht" : "Gerichte"}
            </span>
            <span className="text-[#ede0c4] text-xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
              {finalTotal}€
            </span>
          </div>
        )}
      </div>
    </div>
  );
}