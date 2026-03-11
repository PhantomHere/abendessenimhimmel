"use client";
import { useEffect, useState } from "react";
import { createClient } from "app/lib/supabase/client";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────
type Reservation = {
  id: number;
  created_at: string;
  guest_name: string;
  flight_date: string;
  airship: string;
  table_selection: string;
  order_total: number;
  order_items: { title: string; price: string }[];
};

type Recipe = {
  id: number;
  title: string;
  desc: string;
  price: string;
  img: string;
};

type Tab = "overview" | "reservations" | "recipes";

// ── Component ──────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>("overview");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  // New recipe form state
  const [newRecipe, setNewRecipe] = useState({ title: "", desc: "", price: "", img: "" });
  const [recipeStatus, setRecipeStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  // ── Fetch data ───────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email ?? "");

      const [{ data: res }, { data: rec }] = await Promise.all([
        supabase.from("reservations").select("*").order("created_at", { ascending: false }),
        supabase.from("recipes").select("*").order("created_at", { ascending: true }),
      ]);

      setReservations((res as Reservation[]) ?? []);
      setRecipes((rec as Recipe[]) ?? []);
      setLoading(false);
    };
    init();
  }, []);

  // ── Sign out ─────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // ── Add recipe ───────────────────────────────────────────────────
  const handleAddRecipe = async () => {
    if (!newRecipe.title || !newRecipe.desc || !newRecipe.price || !newRecipe.img) {
      setRecipeStatus({ type: "error", msg: "Bitte alle Felder ausfüllen." });
      return;
    }
    setRecipeLoading(true);
    const { data, error } = await supabase.from("recipes").insert(newRecipe).select().single();
    if (error) {
      setRecipeStatus({ type: "error", msg: "Fehler beim Speichern." });
    } else {
      setRecipes((prev) => [...prev, data as Recipe]);
      setNewRecipe({ title: "", desc: "", price: "", img: "" });
      setRecipeStatus({ type: "success", msg: "Gericht erfolgreich hinzugefügt." });
    }
    setRecipeLoading(false);
    setTimeout(() => setRecipeStatus(null), 3000);
  };

  // ── Delete recipe ────────────────────────────────────────────────
  const handleDeleteRecipe = async (id: number) => {
    if (!confirm("Dieses Gericht wirklich löschen?")) return;
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  // ── Stats ────────────────────────────────────────────────────────
  const totalRevenue = reservations.reduce((sum, r) => sum + (r.order_total ?? 0), 0);
  const uniqueGuests = new Set(reservations.map((r) => r.guest_name)).size;
  const upcomingCount = reservations.filter((r) => new Date(r.flight_date) >= new Date()).length;

  const stats = [
    { label: "Reservierungen", value: reservations.length, sub: "Gesamt" },
    { label: "Umsatz", value: `${totalRevenue}€`, sub: "Gesamt" },
    { label: "Gäste", value: uniqueGuests, sub: "Einzigartig" },
    { label: "Bevorstehend", value: upcomingCount, sub: "Flüge" },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Übersicht" },
    { key: "reservations", label: "Reservierungen" },
    { key: "recipes", label: "Speisekarte" },
  ];

  // ── Shared input style ───────────────────────────────────────────
  const inputClass = "w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors";
  const labelClass = "block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0c0a] flex items-center justify-center gap-4">
        <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
        <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[10px] uppercase animate-pulse" style={{ fontFamily: "var(--font-cinzel)" }}>
          Lade Dashboard
        </span>
        <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0c0a] text-white">

      {/* Top bar */}
      <header className="border-b border-[#c9a84c]/15">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-4 h-px bg-[#c9a84c]" />
            <span className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Aetheria
            </span>
            <span className="text-white/10">·</span>
            <span className="text-[#ede0c4]/40 tracking-[0.2em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[#d4c5a0]/30 text-sm font-light hidden md:block" style={{ fontFamily: "var(--font-cormorant)" }}>
              {userEmail}
            </span>
            <a href="/" className="text-[#d4c5a0]/30 hover:text-[#c9a84c]/60 transition-colors text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel)" }}>
              ← Website
            </a>
            <button
              onClick={handleSignOut}
              className="border border-white/10 hover:border-red-400/40 px-4 py-2 text-white/30 hover:text-red-400/60 transition-all text-[9px] uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-[#ede0c4] text-5xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
            Dashboard <em className="italic text-[#c9a84c]">Übersicht</em>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/8 mb-10 gap-0">
          {tabs.map((t) => (
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

        {/* ── OVERVIEW TAB ──────────────────────────────────────────── */}
        {tab === "overview" && (
          <div>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border border-[#c9a84c]/15 p-6 bg-black/20">
                  <p className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-3" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {stat.label}
                  </p>
                  <p className="text-[#ede0c4] text-4xl font-light mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {stat.value}
                  </p>
                  <p className="text-white/20 text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent reservations preview */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-4 h-px bg-[#c9a84c]" />
                <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Letzte Reservierungen
                </span>
              </div>
              <div className="space-y-3">
                {reservations.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between border border-white/5 p-5 bg-black/10 hover:border-[#c9a84c]/20 transition-colors">
                    <div>
                      <p className="text-[#ede0c4] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{r.guest_name}</p>
                      <p className="text-[#d4c5a0]/30 text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                        {r.airship} · {r.table_selection}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#c9a84c] text-sm tracking-[0.1em]" style={{ fontFamily: "var(--font-cinzel)" }}>{r.order_total}€</p>
                      <p className="text-white/20 text-[9px] uppercase tracking-[0.15em] mt-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                        {new Date(r.flight_date).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                  </div>
                ))}
                {reservations.length === 0 && (
                  <p className="text-[#d4c5a0]/25 text-lg italic py-4" style={{ fontFamily: "var(--font-cormorant)" }}>
                    Noch keine Reservierungen.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── RESERVATIONS TAB ──────────────────────────────────────── */}
        {tab === "reservations" && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-4 h-px bg-[#c9a84c]" />
              <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                Alle Reservierungen ({reservations.length})
              </span>
            </div>

            {reservations.length === 0 ? (
              <p className="text-[#d4c5a0]/25 text-lg italic" style={{ fontFamily: "var(--font-cormorant)" }}>Noch keine Reservierungen.</p>
            ) : (
              <div className="space-y-3">
                {reservations.map((r) => (
                  <details key={r.id} className="border border-white/5 bg-black/10 hover:border-[#c9a84c]/20 transition-colors group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[#ede0c4] text-xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{r.guest_name}</p>
                          <p className="text-[#d4c5a0]/30 text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                            {r.airship} · {r.table_selection}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-[#c9a84c] tracking-[0.1em] text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>{r.order_total}€</p>
                          <p className="text-white/20 text-[9px] uppercase tracking-[0.15em] mt-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                            {new Date(r.flight_date).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className="text-[#c9a84c]/30 group-open:rotate-180 transition-transform duration-300 text-xs">▼</span>
                      </div>
                    </summary>

                    {/* Expanded order details */}
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      <p className="text-[#c9a84c]/40 tracking-[0.3em] text-[9px] uppercase mb-3" style={{ fontFamily: "var(--font-cinzel)" }}>
                        Bestellung
                      </p>
                      <div className="space-y-2">
                        {r.order_items?.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-[#d4c5a0]/50 font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</span>
                            <span className="text-[#c9a84c]/50 text-xs" style={{ fontFamily: "var(--font-cinzel)" }}>{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-white/15 text-[9px] mt-3 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel)" }}>
                        Eingang: {new Date(r.created_at).toLocaleString("de-DE")}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RECIPES TAB ───────────────────────────────────────────── */}
        {tab === "recipes" && (
          <div className="grid md:grid-cols-2 gap-12">

            {/* Add new recipe */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-4 h-px bg-[#c9a84c]" />
                <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Neues Gericht
                </span>
              </div>

              <div className="border border-[#c9a84c]/15 p-7 bg-black/10 space-y-5">
                {[
                  { key: "title", label: "Name", placeholder: "z.B. Rinderfilet" },
                  { key: "desc", label: "Beschreibung", placeholder: "z.B. Mit Trüffelkruste" },
                  { key: "price", label: "Preis", placeholder: "z.B. 40€" },
                  { key: "img", label: "Bild-Pfad", placeholder: "/imgs/dish6.jpg" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className={labelClass} style={{ fontFamily: "var(--font-cinzel)" }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={newRecipe[field.key as keyof typeof newRecipe]}
                      onChange={(e) => setNewRecipe((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className={inputClass}
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                ))}

                {recipeStatus && (
                  <p
                    className={`text-base font-light ${recipeStatus.type === "error" ? "text-red-400/70" : "text-[#c9a84c]/70"}`}
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {recipeStatus.msg}
                  </p>
                )}

                <button
                  onClick={handleAddRecipe}
                  disabled={recipeLoading}
                  className="w-full relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] py-4 text-[#c9a84c] hover:text-[#0d0c0a] tracking-[0.25em] text-[10px] uppercase overflow-hidden transition-all duration-500 disabled:opacity-40"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <span className="relative">{recipeLoading ? "Speichern..." : "+ Gericht hinzufügen"}</span>
                </button>
              </div>
            </div>

            {/* Existing recipes */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-4 h-px bg-[#c9a84c]" />
                <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Aktuelle Speisekarte ({recipes.length})
                </span>
              </div>

              <div className="space-y-3">
                {recipes.map((r) => (
                  <div key={r.id} className="flex items-center justify-between border border-white/5 p-4 bg-black/10 hover:border-[#c9a84c]/15 transition-colors group/recipe">
                    <div className="flex items-center gap-4">
                      <img src={r.img} alt={r.title} className="w-12 h-12 object-cover rounded-sm opacity-70" />
                      <div>
                        <p className="text-[#ede0c4] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{r.title}</p>
                        <p className="text-[#c9a84c]/50 text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-cinzel)" }}>{r.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecipe(r.id)}
                      className="text-white/10 hover:text-red-400/60 transition-colors text-xs opacity-0 group-hover/recipe:opacity-100 px-3 py-1 border border-transparent hover:border-red-400/20"
                    >
                      Löschen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}