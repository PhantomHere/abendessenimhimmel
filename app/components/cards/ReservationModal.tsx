"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Recipe[];
  onSuccess: () => void;
}

type SubmitState = "idle" | "loading" | "success" | "error";

const SILK     = [0.16, 1, 0.3, 1]      as const;
const EDITORIAL = [0.25, 0.1, 0.25, 1]  as const;

// ── Directional step transition ───────────────────────────────────
function useStepVariants(dir: 1 | -1) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return {
      enter:   { opacity: 0 },
      center:  { opacity: 1, x: 0, filter: "blur(0px)" },
      exit:    { opacity: 0 },
    };
  }
  return {
    enter:  { x: dir * 48, opacity: 0, filter: "blur(4px)" },
    center: { x: 0, opacity: 1, filter: "blur(0px)",
              transition: { duration: 0.45, ease: SILK } },
    exit:   { x: dir * -32, opacity: 0, filter: "blur(3px)",
              transition: { duration: 0.3, ease: EDITORIAL } },
  };
}

// ── Success screen ────────────────────────────────────────────────
function SuccessScreen({
  guestName, selectedShip, selectedTable, flightDate, onClose,
}: {
  guestName: string; selectedShip: string;
  selectedTable: number | string | null; flightDate: string; onClose: () => void;
}) {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-md p-12 rounded-sm text-center shadow-2xl"
        initial={{ scale: 0.94, opacity: 0, filter: "blur(8px)" }}
        animate={{ scale: 1,    opacity: 1, filter: "blur(0px)",
                   transition: { duration: 0.55, ease: SILK } }}
        exit={{    scale: 0.96, opacity: 0, filter: "blur(4px)",
                   transition: { duration: 0.3, ease: EDITORIAL } }}
      >
        {/* Checkmark circle — draws in */}
        <motion.div
          className="w-16 h-16 border border-[#c9a84c]/40 rounded-full flex items-center justify-center mx-auto mb-8"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, duration: 0.5, ease: SILK } }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.polyline
              points="20 6 9 17 4 12"
              stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1,
                         transition: { delay: 0.45, duration: 0.55, ease: SILK } }}
            />
          </svg>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.4, ease: SILK } }}
        >
          <div className="w-6 h-px bg-[#c9a84c]" />
          <span className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}>Bestätigt</span>
          <div className="w-6 h-px bg-[#c9a84c]" />
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-3">
          <motion.h2
            className="text-[#ede0c4] text-4xl font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
            initial={{ y: "105%" }}
            animate={{ y: 0, transition: { delay: 0.62, duration: 0.5, ease: SILK } }}
          >
            Guten Flug,{" "}
            <br />
            <em className="italic text-[#c9a84c]">{guestName}</em>
          </motion.h2>
        </div>

        {/* Details stagger */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.72 } } }}
        >
          {[
            `${selectedShip} — ${selectedTable === "Ganzes Schiff" ? "Privat-Charter" : `Tisch ${selectedTable}`}`,
            new Date(flightDate).toLocaleDateString("de-DE",
              { day: "numeric", month: "long", year: "numeric" }),
          ].map((line, i) => (
            <motion.p
              key={i}
              variants={{
                hidden:   { opacity: 0, y: 8 },
                visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: SILK } },
              }}
              className={`font-light mb-2 ${i === 0
                ? "text-[#d4c5a0]/40 text-lg"
                : "text-[#d4c5a0]/30 text-base mb-10"}`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover="hovered" whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.95, duration: 0.4, ease: SILK } }}
          className="w-full relative overflow-hidden border border-[#c9a84c]/40 hover:border-[#c9a84c] py-4 text-[#c9a84c] tracking-[0.25em] text-[10px] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          <motion.span aria-hidden className="absolute inset-0 bg-[#c9a84c] z-0"
            variants={{ hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } } }}
            initial={{ scaleY: 0 }} style={{ originY: "bottom" }} />
          <motion.span className="relative z-10"
            variants={{ hovered: { color: "#0d0c0a" } }}
            transition={{ duration: 0.15 }}>
            Schließen
          </motion.span>
        </motion.button>
      </motion.div>
    </>
  );
}

// ── Main modal ────────────────────────────────────────────────────
export default function ReservationModal({ isOpen, onClose, cartItems, onSuccess }: Props) {
  const [step, setStep]               = useState(1);
  const [prevStep, setPrevStep]       = useState(1);
  const [selectedShip, setSelectedShip]     = useState("");
  const [selectedTable, setSelectedTable]   = useState<number | string | null>(null);
  const [guestName, setGuestName]           = useState("");
  const [flightDate, setFlightDate]         = useState("");
  const [submitState, setSubmitState]       = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg]             = useState("");
  const prefersReduced = useReducedMotion();

  if (!isOpen) return null;

  const dir = step >= prevStep ? 1 : -1;

  const goTo = (next: number) => {
    setPrevStep(step);
    setStep(next);
  };

  const airships = [
    { name: "Zeppelin Luxury",  desc: "Langsam & majestätisch — Panorama-Rundblick über die Alpen",     icon: "I"   },
    { name: "Falcon Express",   desc: "Moderne Hochaltitudinen-Küche — für Kenner der Extraklasse",      icon: "II"  },
    { name: "The Cloud Cruiser",desc: "Open-Deck Gartenerlebnis — Sterne unter freiem Himmel",           icon: "III" },
  ];

  const total      = cartItems.reduce((s, i) => s + parseFloat(i.price.replace("€", "")), 0);
  const finalTotal = selectedTable === "Ganzes Schiff" ? total + 500 : total;

  const handleClose = () => {
    setStep(1); setPrevStep(1); setSelectedShip(""); setSelectedTable(null);
    setGuestName(""); setFlightDate(""); setSubmitState("idle"); setErrorMsg("");
    onClose();
  };

  const handleFinalize = async () => {
    if (!guestName.trim()) { setErrorMsg("Bitte geben Sie Ihren Namen ein.");  return; }
    if (!flightDate)        { setErrorMsg("Bitte wählen Sie ein Flugdatum.");  return; }
    setErrorMsg("");
    setSubmitState("loading");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("reservations").insert({
      guest_name:       guestName.trim(),
      flight_date:      flightDate,
      airship:          selectedShip,
      table_selection:  selectedTable === "Ganzes Schiff" ? "Ganzes Schiff" : `Tisch ${selectedTable}`,
      order_items:      cartItems.map((item) => ({ title: item.title, price: item.price })),
      order_total:      finalTotal,
      user_id:          user?.id ?? null,
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

  // ── step variants (direction-aware) ──
  const sv = useStepVariants(dir);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <AnimatePresence>
        {submitState === "success" ? (
          <SuccessScreen
            guestName={guestName} selectedShip={selectedShip}
            selectedTable={selectedTable} flightDate={flightDate}
            onClose={handleClose}
          />
        ) : (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleClose}
            />

            {/* Modal shell */}
            <motion.div
              className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-5xl max-h-[88vh] rounded-sm overflow-hidden flex shadow-[0_0_80px_rgba(0,0,0,0.8)]"
              initial={prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
                         transition: { duration: 0.55, ease: SILK } }}
              exit={{ opacity: 0, scale: 0.97, y: 12, filter: "blur(4px)",
                      transition: { duration: 0.35, ease: EDITORIAL } }}
            >
              <div className="flex-1 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="border-b border-[#c9a84c]/10 px-10 pt-8 pb-6">
                  <div className="flex items-center gap-4 mb-5">
                    <motion.div
                      className="h-px bg-[#c9a84c]"
                      initial={{ width: 0 }}
                      animate={{ width: 16, transition: { duration: 0.6, ease: SILK } }}
                    />
                    <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase"
                          style={{ fontFamily: "var(--font-cinzel)" }}>Reservierung</span>
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ rotate: 90, color: "#c9a84c" }}
                      transition={{ duration: 0.2 }}
                      className="ml-auto text-[#d4c5a0]/30 text-lg"
                    >✕</motion.button>
                  </div>

                  {/* Step indicators */}
                  <div className="flex items-center gap-0">
                    {stepLabels.map((label, i) => (
                      <div key={label} className="flex items-center">
                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${step > i + 1 ? "opacity-50" : ""}`}>
                          <motion.div
                            animate={{
                              borderColor: step === i + 1 ? "rgba(201,168,76,1)"
                                         : step > i + 1 ? "rgba(201,168,76,0.5)"
                                         : "rgba(255,255,255,0.1)",
                              color:       step === i + 1 ? "rgba(201,168,76,1)"
                                         : step > i + 1 ? "rgba(201,168,76,0.5)"
                                         : "rgba(255,255,255,0.2)",
                              backgroundColor: step === i + 1 ? "rgba(201,168,76,0.1)" : "transparent",
                            }}
                            transition={{ duration: 0.35 }}
                            className="w-6 h-6 flex items-center justify-center border text-[9px]"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            {i + 1}
                          </motion.div>
                          <motion.span
                            animate={{ color: step === i + 1 ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.2)" }}
                            transition={{ duration: 0.35 }}
                            className="text-[9px] uppercase tracking-[0.2em]"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            {label}
                          </motion.span>
                        </div>

                        {/* Connector — animates width on advance */}
                        {i < 2 && (
                          <motion.div
                            className="h-px mx-3"
                            animate={{ backgroundColor: step > i + 1 ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)" }}
                            transition={{ duration: 0.5 }}
                            style={{ width: 48 }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step content — direction-aware slide */}
                <div className="flex-1 overflow-y-auto p-10 relative">
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                      key={step}
                      variants={{
                        enter:  sv.enter,
                        center: sv.center,
                        exit:   sv.exit,
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >

                      {/* ── STEP 1 ── */}
                      {step === 1 && (
                        <div>
                          <div className="overflow-hidden mb-2">
                            <motion.h2
                              className="text-[#ede0c4] text-4xl font-light"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                              initial={{ y: "105%" }}
                              animate={{ y: 0, transition: { delay: 0.05, duration: 0.45, ease: SILK } }}
                            >
                              Wählen Sie Ihr{" "}
                              <em className="italic text-[#c9a84c]">Luftschiff</em>
                            </motion.h2>
                          </div>
                          <motion.p
                            className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.4 } }}
                          >
                            Drei einzigartige Erlebnisse — alle auf 3.000 Metern Höhe.
                          </motion.p>

                          <motion.div
                            className="space-y-3"
                            initial="hidden" animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
                          >
                            {airships.map((ship) => (
                              <motion.button
                                key={ship.name}
                                variants={{
                                  hidden:   { opacity: 0, x: -20, filter: "blur(3px)" },
                                  visible:  { opacity: 1, x: 0, filter: "blur(0px)",
                                              transition: { duration: 0.45, ease: SILK } },
                                }}
                                whileHover="hovered"
                                onClick={() => { setSelectedShip(ship.name); goTo(2); }}
                                className="w-full p-6 border border-white/8 hover:border-[#c9a84c]/60 transition-colors duration-300 text-left group flex items-center gap-6 bg-white/[0.01] hover:bg-[#c9a84c]/5"
                              >
                                <motion.span
                                  variants={{ hovered: { color: "rgba(201,168,76,0.7)" } }}
                                  className="text-[#c9a84c]/25 text-3xl transition-colors font-light w-8"
                                  style={{ fontFamily: "var(--font-cinzel)" }}
                                >
                                  {ship.icon}
                                </motion.span>
                                <div>
                                  <motion.h3
                                    variants={{ hovered: { color: "#c9a84c" } }}
                                    className="text-[#ede0c4] text-xl font-light"
                                    style={{ fontFamily: "var(--font-cormorant)" }}
                                  >
                                    {ship.name}
                                  </motion.h3>
                                  <p className="text-[#d4c5a0]/40 text-sm mt-1 font-light"
                                     style={{ fontFamily: "var(--font-cormorant)" }}>
                                    {ship.desc}
                                  </p>
                                </div>
                                <motion.svg
                                  variants={{ hovered: { x: 4, opacity: 0.7 } }}
                                  initial={{ opacity: 0 }}
                                  className="ml-auto w-4 h-4 text-[#c9a84c]"
                                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                >
                                  <path d="M5 12h14M12 5l7 7-7 7"/>
                                </motion.svg>
                              </motion.button>
                            ))}
                          </motion.div>
                        </div>
                      )}

                      {/* ── STEP 2 ── */}
                      {step === 2 && (
                        <div>
                          <div className="overflow-hidden mb-2">
                            <motion.h2
                              className="text-[#ede0c4] text-4xl font-light"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                              initial={{ y: "105%" }}
                              animate={{ y: 0, transition: { delay: 0.05, duration: 0.45, ease: SILK } }}
                            >
                              Sitzplan:{" "}
                              <em className="italic text-[#c9a84c]">{selectedShip}</em>
                            </motion.h2>
                          </div>
                          <motion.p
                            className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.4 } }}
                          >
                            Wählen Sie einen Tisch oder reservieren Sie das gesamte Schiff.
                          </motion.p>

                          {/* Private charter */}
                          <motion.button
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0,
                                       transition: { delay: 0.18, duration: 0.4, ease: SILK } }}
                            whileHover="hovered"
                            onClick={() => { setSelectedTable("Ganzes Schiff"); goTo(3); }}
                            className="w-full p-5 border border-[#c9a84c]/30 hover:border-[#c9a84c] hover:bg-[#c9a84c]/5 transition-colors duration-300 mb-6 flex items-center justify-between"
                          >
                            <div className="text-left">
                              <p className="text-[#c9a84c] tracking-[0.2em] text-[10px] uppercase"
                                 style={{ fontFamily: "var(--font-cinzel)" }}>Privat-Charter</p>
                              <p className="text-[#ede0c4] text-xl font-light mt-1"
                                 style={{ fontFamily: "var(--font-cormorant)" }}>Gesamtes Schiff reservieren</p>
                            </div>
                            <motion.span
                              variants={{ hovered: { color: "#c9a84c", x: -3 } }}
                              className="text-[#c9a84c]/50 text-sm tracking-[0.15em] uppercase"
                              style={{ fontFamily: "var(--font-cinzel)" }}
                            >
                              +500€
                            </motion.span>
                          </motion.button>

                          <motion.div
                            className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-4"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.22, duration: 0.3 } }}
                          >
                            Einzeltische
                          </motion.div>

                          {/* Seat grid — spring stagger */}
                          <motion.div
                            className="grid grid-cols-4 gap-3"
                            initial="hidden" animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.25 } } }}
                          >
                            {[...Array(12)].map((_, i) => (
                              <motion.button
                                key={i}
                                variants={{
                                  hidden:  { opacity: 0, scale: 0.75, filter: "blur(3px)" },
                                  visible: { opacity: 1, scale: 1, filter: "blur(0px)",
                                             transition: { type: "spring", stiffness: 400, damping: 22 } },
                                }}
                                whileHover={{ scale: 1.06, borderColor: "rgba(201,168,76,0.7)",
                                              backgroundColor: "rgba(201,168,76,0.07)",
                                              transition: { duration: 0.18 } }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setSelectedTable(i + 1); goTo(3); }}
                                className="h-14 border border-white/10 text-[#d4c5a0]/50 hover:text-[#c9a84c] transition-colors text-xs tracking-[0.15em] uppercase"
                                style={{ fontFamily: "var(--font-cinzel)" }}
                              >
                                {i + 1}
                              </motion.button>
                            ))}
                          </motion.div>

                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.3 } }}
                            whileHover={{ x: -3, color: "#c9a84c" }}
                            onClick={() => goTo(1)}
                            className="mt-6 text-[#d4c5a0]/30 transition-colors text-xs tracking-[0.2em] uppercase flex items-center gap-2"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            ← Zurück
                          </motion.button>
                        </div>
                      )}

                      {/* ── STEP 3 ── */}
                      {step === 3 && (
                        <div>
                          <div className="overflow-hidden mb-2">
                            <motion.h2
                              className="text-[#ede0c4] text-4xl font-light"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                              initial={{ y: "105%" }}
                              animate={{ y: 0, transition: { delay: 0.05, duration: 0.45, ease: SILK } }}
                            >
                              Fast{" "}
                              <em className="italic text-[#c9a84c]">fertig</em>
                            </motion.h2>
                          </div>
                          <motion.p
                            className="text-[#d4c5a0]/40 mb-8 text-lg font-light"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.4 } }}
                          >
                            Bitte vervollständigen Sie Ihre Angaben.
                          </motion.p>

                          {/* Summary card */}
                          <motion.div
                            className="border border-[#c9a84c]/20 p-6 mb-6"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0,
                                       transition: { delay: 0.18, duration: 0.4, ease: SILK } }}
                          >
                            <span className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase"
                                  style={{ fontFamily: "var(--font-cinzel)" }}>Ihre Wahl</span>
                            <p className="text-[#ede0c4] text-xl font-light mt-1"
                               style={{ fontFamily: "var(--font-cormorant)" }}>
                              {selectedShip}{" "}
                              <span className="text-[#c9a84c]/60">—</span>{" "}
                              {selectedTable === "Ganzes Schiff" ? "Privat-Charter" : `Tisch ${selectedTable}`}
                            </p>
                          </motion.div>

                          {/* Inputs */}
                          <motion.div
                            className="grid grid-cols-2 gap-4 mb-6"
                            initial="hidden" animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
                          >
                            {[
                              {
                                label: "Flugdatum",
                                content: (
                                  <input type="date" value={flightDate}
                                    onChange={(e) => setFlightDate(e.target.value)}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] outline-none transition-colors"
                                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }} />
                                ),
                              },
                              {
                                label: "Passagier-Name",
                                content: (
                                  <input type="text" placeholder="Ihr Name" value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/20 outline-none transition-colors"
                                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }} />
                                ),
                              },
                            ].map(({ label, content }) => (
                              <motion.div
                                key={label}
                                variants={{
                                  hidden:  { opacity: 0, y: 12 },
                                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SILK } },
                                }}
                              >
                                <label className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                                       style={{ fontFamily: "var(--font-cinzel)" }}>{label}</label>
                                {content}
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Error */}
                          <AnimatePresence mode="wait">
                            {errorMsg && (
                              <motion.p
                                key={errorMsg}
                                initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.3, ease: EDITORIAL }}
                                className="text-red-400/70 text-base font-light mb-4"
                                style={{ fontFamily: "var(--font-cormorant)" }}
                              >
                                {errorMsg}
                              </motion.p>
                            )}
                          </AnimatePresence>

                          {/* Confirm button */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0,
                                       transition: { delay: 0.4, duration: 0.4, ease: SILK } }}
                          >
                            <motion.button
                              onClick={handleFinalize}
                              disabled={submitState === "loading"}
                              whileHover={submitState !== "loading" ? "hovered" : undefined}
                              whileTap={submitState !== "loading" ? { scale: 0.98 } : undefined}
                              className="w-full relative overflow-hidden border border-[#c9a84c]/60 hover:border-[#c9a84c] py-5 text-[#c9a84c] tracking-[0.25em] text-[10px] uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ fontFamily: "var(--font-cinzel)" }}
                            >
                              <motion.span aria-hidden
                                className="absolute inset-0 bg-[#c9a84c] z-0"
                                variants={{ hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } } }}
                                initial={{ scaleY: 0 }} style={{ originY: "bottom" }}
                              />
                              <motion.span className="relative z-10"
                                variants={{ hovered: { color: "#0d0c0a" } }}
                                transition={{ duration: 0.15 }}>
                                {submitState === "loading"
                                  ? "Wird gespeichert…"
                                  : `Bestätigen & Bezahlen — ${finalTotal}€`}
                              </motion.span>
                            </motion.button>
                          </motion.div>

                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.3 } }}
                            whileHover={{ x: -3, color: "#c9a84c" }}
                            onClick={() => goTo(2)}
                            className="w-full mt-3 text-center text-[#d4c5a0]/25 transition-colors text-xs tracking-[0.2em] uppercase"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            ← Sitzplan ändern
                          </motion.button>
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <div className="w-72 border-l border-[#c9a84c]/10 bg-black/20 flex flex-col">
                <div className="p-7 border-b border-[#c9a84c]/10">
                  <span className="text-[#c9a84c]/50 tracking-[0.35em] text-[9px] uppercase"
                        style={{ fontFamily: "var(--font-cinzel)" }}>Ihre Bestellung</span>
                </div>

                <div className="flex-1 overflow-y-auto p-7 space-y-5">
                  <AnimatePresence initial={false}>
                    {cartItems.length === 0 ? (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-[#d4c5a0]/25 text-lg italic"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        Noch keine Speisen gewählt.
                      </motion.p>
                    ) : (
                      cartItems.map((item, i) => (
                        <motion.div
                          key={item.title + i}
                          initial={{ opacity: 0, x: 16, filter: "blur(3px)" }}
                          animate={{ opacity: 1, x: 0, filter: "blur(0px)",
                                     transition: { delay: i * 0.06, duration: 0.4, ease: SILK } }}
                          exit={{ opacity: 0, x: -10, transition: { duration: 0.25 } }}
                          className="flex justify-between items-baseline"
                        >
                          <span className="text-[#d4c5a0]/60 text-base font-light"
                                style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</span>
                          <span className="text-[#c9a84c]/70 text-xs tracking-[0.1em]"
                                style={{ fontFamily: "var(--font-cinzel)" }}>{item.price}</span>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Total — animates when value changes */}
                <div className="p-7 border-t border-[#c9a84c]/10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#c9a84c]/50 tracking-[0.2em] text-[9px] uppercase"
                          style={{ fontFamily: "var(--font-cinzel)" }}>Total</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={finalTotal}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: SILK } }}
                        exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
                        className="text-[#ede0c4] text-2xl font-light"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {finalTotal}€
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}