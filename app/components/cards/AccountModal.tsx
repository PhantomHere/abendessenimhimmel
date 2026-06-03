"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "app/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Reservation = {
  id: number;
  created_at: string;
  flight_date: string;
  airship: string;
  table_selection: string;
  order_total: number;
  order_items: { title: string; price: string }[];
};

type Profile = {
  email: string;
  role: string;
  created_at: string;
};

type Tab = "reservations" | "profile";

const SILK      = [0.16, 1, 0.3, 1]     as const;
const EDITORIAL = [0.25, 0.1, 0.25, 1]  as const;
const TABS: { key: Tab; label: string }[] = [
  { key: "reservations", label: "Reservierungen" },
  { key: "profile",      label: "Profil" },
];

export default function AccountModal({ isOpen, onClose }: Props) {
  const router    = useRouter();
  const supabase  = createClient();
  const prefersReduced = useReducedMotion();

  const [tab,          setTab]          = useState<Tab>("reservations");
  const [prevTab,      setPrevTab]      = useState<Tab>("reservations");
  const [profile,      setProfile]      = useState<Profile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const init = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsLoggedIn(false); setLoading(false); return; }
      setIsLoggedIn(true);

      const [{ data: prof }, { data: res }] = await Promise.all([
        supabase.from("profiles").select("email, role, created_at").eq("id", user.id).single(),
        supabase.from("reservations").select("*").eq("user_id", user.id).order("flight_date", { ascending: false }),
      ]);

      setProfile(prof as Profile);
      setReservations((res as Reservation[]) ?? []);
      setLoading(false);
    };
    init();
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    router.refresh();
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Möchten Sie diese Reservierung wirklich stornieren?")) return;
    setCancellingId(id);
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (!error) setReservations((prev) => prev.filter((r) => r.id !== id));
    setCancellingId(null);
  };

  const switchTab = (next: Tab) => {
    setPrevTab(tab);
    setTab(next);
  };

  // Tab slide direction — reservations(0) → profile(1) = forward
  const tabIndex   = (t: Tab) => TABS.findIndex((x) => x.key === t);
  const tabDir     = tabIndex(tab) >= tabIndex(prevTab) ? 1 : -1;

  const tabVariants = {
    enter:  prefersReduced
      ? { opacity: 0 }
      : { x: tabDir * 32, opacity: 0, filter: "blur(3px)" },
    center: { x: 0, opacity: 1, filter: "blur(0px)",
              transition: { duration: 0.38, ease: SILK } },
    exit:   prefersReduced
      ? { opacity: 0 }
      : { x: tabDir * -24, opacity: 0, filter: "blur(2px)",
          transition: { duration: 0.25, ease: EDITORIAL } },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">

      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Modal shell */}
      <motion.div
        className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-xl max-h-[85vh] rounded-sm overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        initial={prefersReduced
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.96, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)",
                   transition: { duration: 0.52, ease: SILK } }}
        exit={{ opacity: 0, scale: 0.97, y: 10, filter: "blur(4px)",
                transition: { duration: 0.3, ease: EDITORIAL } }}
      >

        {/* ── Header ── */}
        <div className="border-b border-[#c9a84c]/10 px-8 pt-7 pb-5 flex-shrink-0">
          <div className="flex items-center gap-4 mb-1">
            <motion.div
              className="h-px bg-[#c9a84c]"
              initial={{ width: 0 }}
              animate={{ width: 16, transition: { duration: 0.6, ease: SILK } }}
            />
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 0.5, x: 0,
                         transition: { delay: 0.2, duration: 0.4, ease: SILK } }}
              className="text-[#c9a84c] tracking-[0.4em] text-[9px] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Mein Konto
            </motion.span>

            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90, color: "#c9a84c" }}
              transition={{ duration: 0.2 }}
              className="ml-auto text-[#d4c5a0]/30"
            >
              ✕
            </motion.button>
          </div>

          {/* Title clips up */}
          <div className="overflow-hidden">
            <motion.h2
              className="text-[#ede0c4] text-3xl font-light"
              style={{ fontFamily: "var(--font-cormorant)" }}
              initial={{ y: "105%" }}
              animate={{ y: 0, transition: { delay: 0.15, duration: 0.5, ease: SILK } }}
            >
              {isLoggedIn && profile ? (
                <>Willkommen, <em className="italic text-[#c9a84c]">{profile.email.split("@")[0]}</em></>
              ) : (
                "Anmelden"
              )}
            </motion.h2>
          </div>
        </div>

        {/* ── Loading ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 overflow-hidden relative"
            >
              <motion.div
                className="absolute h-px w-1/3 bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent"
                animate={{ x: ["-33%", "400%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <span
                className="text-[#c9a84c]/40 tracking-[0.4em] text-[10px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Laden
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Not logged in ── */}
        <AnimatePresence>
          {!loading && !isLoggedIn && (
            <motion.div
              key="not-logged-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: SILK } }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.4, y: 0,
                           transition: { delay: 0.1, duration: 0.4, ease: SILK } }}
                className="text-[#d4c5a0] text-xl font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bitte melden Sie sich an, um Ihre Reservierungen einzusehen.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0,
                           transition: { delay: 0.2, duration: 0.4, ease: SILK } }}
              >
                <motion.a
                  href="/login"
                  whileHover="hovered"
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden border border-[#c9a84c]/50 hover:border-[#c9a84c] px-8 py-3 text-[#c9a84c] inline-block text-[10px] uppercase tracking-[0.25em]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-[#c9a84c] z-0"
                    variants={{ hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } } }}
                    initial={{ scaleY: 0 }}
                    style={{ originY: "bottom" }}
                  />
                  <motion.span
                    className="relative z-10"
                    variants={{ hovered: { color: "#0d0c0a" } }}
                    transition={{ duration: 0.15 }}
                  >
                    Zur Anmeldung
                  </motion.span>
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Logged in content ── */}
        <AnimatePresence>
          {!loading && isLoggedIn && (
            <motion.div
              key="logged-in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Tabs — sliding layoutId underline */}
              <div className="flex border-b border-white/8 flex-shrink-0 relative">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => switchTab(t.key)}
                    className="relative px-8 py-3 text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 -mb-px"
                    style={{
                      fontFamily: "var(--font-cinzel)",
                      color: tab === t.key ? "#c9a84c" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {t.label}
                    {/* Sliding underline */}
                    {tab === t.key && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-px bg-[#c9a84c]"
                        transition={{ duration: 0.3, ease: SILK }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content — directional slide */}
              <div className="flex-1 overflow-y-auto relative">
                <AnimatePresence mode="wait" custom={tabDir}>
                  <motion.div
                    key={tab}
                    variants={tabVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="p-8"
                  >

                    {/* ── RESERVATIONS ── */}
                    {tab === "reservations" && (
                      <div>
                        {reservations.length === 0 ? (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 0.3, y: 0,
                                       transition: { duration: 0.4, ease: SILK } }}
                            className="text-[#d4c5a0] text-xl italic"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                          >
                            Sie haben noch keine Reservierungen.
                          </motion.p>
                        ) : (
                          <motion.div
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                          >
                            <AnimatePresence initial={false}>
                              {reservations.map((r) => {
                                const isPast = new Date(r.flight_date) < new Date();
                                return (
                                  <motion.div
                                    key={r.id}
                                    variants={{
                                      hidden:   { opacity: 0, y: 16, filter: "blur(3px)" },
                                      visible:  { opacity: isPast ? 0.5 : 1, y: 0,
                                                  filter: "blur(0px)",
                                                  transition: { duration: 0.45, ease: SILK } },
                                    }}
                                    exit={{ opacity: 0, x: -20, filter: "blur(4px)",
                                            height: 0, marginBottom: 0, paddingTop: 0,
                                            transition: { duration: 0.4, ease: EDITORIAL } }}
                                    className={`border p-5 transition-colors ${
                                      isPast
                                        ? "border-white/5"
                                        : "border-[#c9a84c]/15 hover:border-[#c9a84c]/30"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                      <div>
                                        <p
                                          className="text-[#ede0c4] text-xl font-light"
                                          style={{ fontFamily: "var(--font-cormorant)" }}
                                        >
                                          {r.airship}
                                        </p>
                                        <p
                                          className="text-[#d4c5a0]/40 text-base font-light"
                                          style={{ fontFamily: "var(--font-cormorant)" }}
                                        >
                                          {r.table_selection}
                                        </p>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p
                                          className="text-[#c9a84c] text-xs tracking-[0.1em]"
                                          style={{ fontFamily: "var(--font-cinzel)" }}
                                        >
                                          {r.order_total}€
                                        </p>
                                        <p
                                          className={`text-[9px] uppercase tracking-[0.15em] mt-1 ${
                                            isPast ? "text-white/20" : "text-[#c9a84c]/50"
                                          }`}
                                          style={{ fontFamily: "var(--font-cinzel)" }}
                                        >
                                          {isPast
                                            ? "Vergangen"
                                            : new Date(r.flight_date).toLocaleDateString("de-DE", {
                                                day: "numeric", month: "long", year: "numeric",
                                              })}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Order items */}
                                    <div className="border-t border-white/5 pt-3 mb-3 space-y-1">
                                      {r.order_items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                          <span
                                            className="text-[#d4c5a0]/40 font-light"
                                            style={{ fontFamily: "var(--font-cormorant)" }}
                                          >
                                            {item.title}
                                          </span>
                                          <span
                                            className="text-[#c9a84c]/40 text-xs"
                                            style={{ fontFamily: "var(--font-cinzel)" }}
                                          >
                                            {item.price}
                                          </span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Cancel */}
                                    {!isPast && (
                                      <motion.button
                                        onClick={() => handleCancel(r.id)}
                                        disabled={cancellingId === r.id}
                                        whileHover={{ color: "rgba(248,113,113,0.75)" }}
                                        transition={{ duration: 0.2 }}
                                        className="text-red-400/40 transition-colors text-[9px] uppercase tracking-[0.2em] disabled:opacity-30"
                                        style={{ fontFamily: "var(--font-cinzel)" }}
                                      >
                                        {cancellingId === r.id
                                          ? "Wird storniert…"
                                          : "Reservierung stornieren"}
                                      </motion.button>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* ── PROFILE ── */}
                    {tab === "profile" && profile && (
                      <motion.div
                        className="space-y-6"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
                      >
                        {[
                          { label: "E-Mail",         value: profile.email },
                          { label: "Mitglied seit",  value: new Date(profile.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }) },
                          { label: "Rolle",          value: profile.role === "admin" ? "Administrator" : "Gast" },
                          { label: "Reservierungen", value: `${reservations.length} gesamt` },
                        ].map((item) => (
                          <motion.div
                            key={item.label}
                            variants={{
                              hidden:  { opacity: 0, x: -14, filter: "blur(2px)" },
                              visible: { opacity: 1, x: 0, filter: "blur(0px)",
                                         transition: { duration: 0.4, ease: SILK } },
                            }}
                            className="border-b border-white/5 pb-5"
                          >
                            <p
                              className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-2"
                              style={{ fontFamily: "var(--font-cinzel)" }}
                            >
                              {item.label}
                            </p>
                            <p
                              className="text-[#ede0c4] text-lg font-light"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                            >
                              {item.value}
                            </p>
                          </motion.div>
                        ))}

                        {/* Sign out */}
                        <motion.div
                          variants={{
                            hidden:  { opacity: 0, y: 8 },
                            visible: { opacity: 1, y: 0,
                                       transition: { duration: 0.4, ease: SILK } },
                          }}
                        >
                          <motion.button
                            onClick={handleSignOut}
                            whileHover="hovered"
                            whileTap={{ scale: 0.98 }}
                            className="w-full relative overflow-hidden border border-red-400/20 hover:border-red-400/50 py-3 text-red-400/40 text-[9px] uppercase tracking-[0.25em] mt-4"
                            style={{ fontFamily: "var(--font-cinzel)" }}
                          >
                            <motion.span
                              aria-hidden
                              className="absolute inset-0 z-0"
                              style={{ backgroundColor: "rgba(248,113,113,0.08)", originY: "bottom" }}
                              variants={{ hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } } }}
                              initial={{ scaleY: 0 }}
                            />
                            <motion.span
                              className="relative z-10"
                              variants={{ hovered: { color: "rgba(248,113,113,0.8)" } }}
                              transition={{ duration: 0.15 }}
                            >
                              Abmelden
                            </motion.span>
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}