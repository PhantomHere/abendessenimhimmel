"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

// ── Scroll-reveal hook ────────────────────────────────────────────
function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Full-screen dish detail overlay ──────────────────────────────
function DishDetail({
  recipe,
  onClose,
  onAdd,
}: {
  recipe: Recipe;
  onClose: () => void;
  onAdd: (recipe: Recipe) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => setVisible(true));
    return () => {
      document.body.style.overflow = "";
      cancelAnimationFrame(t);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 420);
  };

  const handleAdd = () => {
    onAdd(recipe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const ingredientList: string[] =
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string" && recipe.ingredients.trim()
      ? recipe.ingredients.split(",").map((s) => s.trim())
      : [];

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.42s ease",
      }}
    >
      {/* Backdrop — tap to close */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel — slides up from bottom on mobile, slides in from right on desktop */}
      <div
        className="relative mt-auto sm:mt-0 sm:ml-auto w-full sm:w-[520px] md:w-[580px] h-[92vh] sm:h-full bg-[#0d0c0a] border-t sm:border-t-0 sm:border-l border-[#c9a84c]/20 flex flex-col overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.7)] sm:shadow-[-20px_0_80px_rgba(0,0,0,0.7)]"
        style={{
          transform: visible
            ? "translate(0,0)"
            : "translateY(100%) ",
          transition: "transform 0.42s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Hero image ── */}
        <div className="relative w-full h-[42vh] sm:h-[48vh] flex-shrink-0 overflow-hidden">
          <Image
            src={recipe.img}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 580px"
            priority
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0c0a]/20 to-transparent" />

          {/* Gold corner marks */}
          {[
            "top-0 left-0",
            "top-0 right-0",
            "bottom-0 left-0",
            "bottom-0 right-0",
          ].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
              <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} left-0 right-0 h-px bg-[#c9a84c]/40`} />
              <div className={`absolute top-0 bottom-0 ${pos.includes("left") ? "left-0" : "right-0"} w-px bg-[#c9a84c]/40`} />
            </div>
          ))}

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-[#c9a84c]/30 bg-[#0d0c0a]/60 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/60 transition-all duration-200 backdrop-blur-sm"
            aria-label="Schließen"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Price badge */}
          <div className="absolute bottom-5 left-5">
            <span
              className="text-[#c9a84c] tracking-[0.3em] text-xs uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {recipe.price}
            </span>
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-8 pt-6 pb-10">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-px bg-[#c9a84c]/60" />
              <span
                className="text-[#c9a84c]/50 tracking-[0.4em] text-[8px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Saison 2026
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-[#ede0c4] text-3xl sm:text-4xl font-light leading-tight mb-5"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {recipe.title}
            </h2>

            {/* Description */}
            <p
              className="text-[#d4c5a0]/60 text-base sm:text-lg leading-relaxed font-light mb-7"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {recipe.desc}
            </p>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#c9a84c]/20 via-[#c9a84c]/08 to-transparent mb-7" />

            {/* Ingredients */}
            {ingredientList.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[#c9a84c]/45 tracking-[0.4em] text-[8px] uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Zutaten
                  </span>
                  <div className="flex-1 h-px bg-[#c9a84c]/08" />
                </div>
                <ul className="flex flex-wrap gap-2">
                  {ingredientList.map((ing, i) => (
                    <li
                      key={ing}
                      className="text-[#d4c5a0]/65 bg-[#c9a84c]/[0.06] border border-[#c9a84c]/12 px-3 py-1 text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(8px)",
                        transition: `opacity 0.4s ease ${200 + i * 35}ms, transform 0.4s ease ${200 + i * 35}ms`,
                      }}
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAdd}
              className="w-full relative overflow-hidden border py-4 text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-all duration-400 group/add"
              style={{
                fontFamily: "var(--font-cinzel)",
                borderColor: added ? "transparent" : "rgba(201,168,76,0.5)",
                color: added ? "#0d0c0a" : "#c9a84c",
                backgroundColor: added ? "#c9a84c" : "transparent",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `border-color 0.3s, color 0.3s, background-color 0.3s, opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s`,
              }}
            >
              {!added && (
                <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover/add:translate-y-0 transition-transform duration-350" />
              )}
              <span className="relative" style={{ color: added ? "#0d0c0a" : undefined }}>
                {added ? (
                  "✓ Zur Auswahl hinzugefügt"
                ) : (
                  <>
                    <span className="group-hover/add:hidden">Zum Menü hinzufügen — {recipe.price}</span>
                    <span className="hidden group-hover/add:inline" style={{ color: "#0d0c0a" }}>Zum Menü hinzufügen — {recipe.price}</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Compact menu row ──────────────────────────────────────────────
function MenuRow({
  recipe,
  index,
  onOpen,
  inView,
}: {
  recipe: Recipe;
  index: number;
  onOpen: () => void;
  inView: boolean;
}) {
  const ingredientList: string[] =
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string" && recipe.ingredients.trim()
      ? recipe.ingredients.split(",").map((s) => s.trim())
      : [];

  const delay = `${index * 55}ms`;

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-4 sm:gap-5 py-4 sm:py-5 text-left border-b border-[#c9a84c]/10 last:border-0 group transition-all duration-300 hover:pl-2"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}, padding-left 0.25s ease`,
      }}
    >
      {/* Index */}
      <span
        className="text-[#c9a84c]/20 text-[10px] tracking-[0.3em] w-5 flex-shrink-0 select-none group-hover:text-[#c9a84c]/50 transition-colors duration-300"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Thumbnail */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-sm border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/35 transition-all duration-400">
        <Image
          src={recipe.img}
          alt={recipe.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
          sizes="48px"
        />
      </div>

      {/* Name + hint */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[#ede0c4] text-base sm:text-lg font-light leading-snug truncate group-hover:text-[#c9a84c] transition-colors duration-300"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {recipe.title}
        </p>
        <p
          className="text-[#d4c5a0]/25 text-xs font-light mt-0.5 truncate"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {ingredientList.slice(0, 4).join(" · ")}
          {ingredientList.length > 4 ? " · …" : ""}
        </p>
      </div>

      {/* Price */}
      <span
        className="text-[#c9a84c]/55 tracking-[0.2em] text-[10px] uppercase flex-shrink-0 group-hover:text-[#c9a84c] transition-colors duration-300"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {recipe.price}
      </span>

      {/* Arrow */}
      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/40 transition-all duration-300">
        <svg
          width="7" height="7" viewBox="0 0 7 7" fill="none"
          className="text-[#c9a84c]/30 group-hover:text-[#c9a84c]/70 transition-colors duration-300"
          style={{ transform: "translateX(0.5px)" }}
        >
          <path d="M1 1l3 2.5L1 6M4 3.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────────
export default function RecipeCarousel({ onAdd }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const { ref, inView } = useInView(0.08);

  useEffect(() => {
    const fetchRecipes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        setError("Speisekarte konnte nicht geladen werden.");
        console.error("Supabase fetch error:", error);
      } else {
        setRecipes(data as Recipe[]);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, []);

  return (
    <>
      <section id="menu" className="py-14 sm:py-24 bg-[#0d0c0a]">
        <div className="max-w-2xl mx-auto px-4 sm:px-8" ref={ref}>

          {/* Header */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#c9a84c]" />
              <span
                className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Saison 2026
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
              <h2
                className="text-[#ede0c4] text-4xl sm:text-5xl font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Saisonal{" "}
                <em className="italic text-[#c9a84c] font-light">Empfohlen</em>
              </h2>
              <p
                className="text-[#d4c5a0]/25 text-xs"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Tippen für Details
              </p>
            </div>
          </div>

          {/* Top rule */}
          <div
            className="h-px mb-0"
            style={{
              background: "linear-gradient(to right, rgba(201,168,76,0.35), rgba(201,168,76,0.06), transparent)",
              opacity: inView ? 1 : 0,
              transition: "opacity 0.8s ease 0.2s",
            }}
          />

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-32 gap-4">
              <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
              <span
                className="text-[#c9a84c]/50 tracking-[0.4em] text-[10px] uppercase animate-pulse"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Speisekarte wird geladen
              </span>
              <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400/70 text-lg font-light text-center mt-8" style={{ fontFamily: "var(--font-cormorant)" }}>
              {error}
            </p>
          )}

          {/* Menu rows */}
          {!loading && !error && (
            <>
              <div className="border-t border-[#c9a84c]/10">
                {recipes.map((recipe, index) => (
                  <MenuRow
                    key={recipe.id ?? recipe.title}
                    recipe={recipe}
                    index={index}
                    onOpen={() => setActiveRecipe(recipe)}
                    inView={inView}
                  />
                ))}
              </div>

              {/* Footer note */}
              <div
                className="mt-8 flex items-center gap-5"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: "opacity 0.8s ease 0.55s",
                }}
              >
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(201,168,76,0.15), transparent)" }} />
                <span
                  className="text-[#c9a84c]/20 tracking-[0.35em] text-[8px] uppercase flex-shrink-0"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  Frisch zubereitet an Bord
                </span>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(201,168,76,0.15), transparent)" }} />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Detail overlay — rendered outside section so it can cover the full screen */}
      {activeRecipe && (
        <DishDetail
          recipe={activeRecipe}
          onClose={() => setActiveRecipe(null)}
          onAdd={onAdd}
        />
      )}
    </>
  );
}