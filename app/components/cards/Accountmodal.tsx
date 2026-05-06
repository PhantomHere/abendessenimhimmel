"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
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

export default function AccountModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("reservations");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  if (!isOpen) return null;

  const tabItems: { key: Tab; label: string }[] = [
    { key: "reservations", label: "Reservierungen" },
    { key: "profile", label: "Profil" },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#0d0c0a] border border-[#c9a84c]/25 w-full max-w-xl max-h-[85vh] rounded-sm overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]">

        {/* Header */}
        <div className="border-b border-[#c9a84c]/10 px-8 pt-7 pb-5 flex-shrink-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="w-4 h-px bg-[#c9a84c]" />
            <span
              className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Mein Konto
            </span>
            <button
              onClick={onClose}
              className="ml-auto text-[#d4c5a0]/30 hover:text-[#c9a84c] transition-colors"
            >
              ✕
            </button>
          </div>
          <h2
            className="text-[#ede0c4] text-3xl font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {isLoggedIn && profile
              ? <>Willkommen, <em className="italic text-[#c9a84c]">{profile.email.split("@")[0]}</em></>
              : "Anmelden"}
          </h2>
        </div>

        {/* Not logged in */}
        {!loading && !isLoggedIn && (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-6">
            <p
              className="text-[#d4c5a0]/40 text-xl font-light"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Bitte melden Sie sich an, um Ihre Reservierungen einzusehen.
            </p>
            <a
              href="/login"
              className="border border-[#c9a84c]/50 hover:border-[#c9a84c] px-8 py-3 text-[#c9a84c] hover:text-[#0d0c0a] relative group overflow-hidden transition-all duration-500 text-[10px] uppercase tracking-[0.25em]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
              <span className="relative">Zur Anmeldung</span>
            </a>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center gap-4">
            <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
            <span
              className="text-[#c9a84c]/50 tracking-[0.4em] text-[10px] uppercase animate-pulse"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Laden
            </span>
            <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
          </div>
        )}

        {/* Logged in content */}
        {!loading && isLoggedIn && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-white/8 flex-shrink-0">
              {tabItems.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-8 py-3 text-[9px] uppercase tracking-[0.25em] transition-all duration-300 border-b-2 -mb-px ${
                    tab === t.key
                      ? "border-[#c9a84c] text-[#c9a84c]"
                      : "border-transparent text-white/25 hover:text-white/50"
                  }`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-8">

              {/* RESERVATIONS */}
              {tab === "reservations" && (
                <div>
                  {reservations.length === 0 ? (
                    <p
                      className="text-[#d4c5a0]/30 text-xl italic"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Sie haben noch keine Reservierungen.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map((r) => {
                        const isPast = new Date(r.flight_date) < new Date();
                        return (
                          <div
                            key={r.id}
                            className={`border p-5 transition-colors ${
                              isPast ? "border-white/5 opacity-50" : "border-[#c9a84c]/15 hover:border-[#c9a84c]/30"
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
                                  className={`text-[9px] uppercase tracking-[0.15em] mt-1 ${isPast ? "text-white/20" : "text-[#c9a84c]/50"}`}
                                  style={{ fontFamily: "var(--font-cinzel)" }}
                                >
                                  {isPast ? "Vergangen" : new Date(r.flight_date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                            </div>

                            {/* Order items */}
                            <div className="border-t border-white/5 pt-3 mb-3 space-y-1">
                              {r.order_items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-[#d4c5a0]/40 font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</span>
                                  <span className="text-[#c9a84c]/40 text-xs" style={{ fontFamily: "var(--font-cinzel)" }}>{item.price}</span>
                                </div>
                              ))}
                            </div>

                            {/* Cancel button — only for future reservations */}
                            {!isPast && (
                              <button
                                onClick={() => handleCancel(r.id)}
                                disabled={cancellingId === r.id}
                                className="text-red-400/40 hover:text-red-400/70 transition-colors text-[9px] uppercase tracking-[0.2em] disabled:opacity-30"
                                style={{ fontFamily: "var(--font-cinzel)" }}
                              >
                                {cancellingId === r.id ? "Wird storniert..." : "Reservierung stornieren"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE */}
              {tab === "profile" && profile && (
                <div className="space-y-6">
                  {[
                    { label: "E-Mail", value: profile.email },
                    { label: "Mitglied seit", value: new Date(profile.created_at).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Rolle", value: profile.role === "admin" ? "Administrator" : "Gast" },
                    { label: "Reservierungen", value: `${reservations.length} gesamt` },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-white/5 pb-5">
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
                    </div>
                  ))}

                  <button
                    onClick={handleSignOut}
                    className="w-full border border-red-400/20 hover:border-red-400/50 py-3 text-red-400/40 hover:text-red-400/70 transition-all text-[9px] uppercase tracking-[0.25em] mt-4"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}