"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AccordionItem({
  recipe,
  index,
  isOpen,
  onToggle,
  onAdd,
  inView,
}: {
  recipe: Recipe;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onAdd: (recipe: Recipe) => void;
  inView: boolean;
}) {
  const [added, setAdded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const ingredientList: string[] =
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string" && recipe.ingredients.trim()
      ? recipe.ingredients.split(",").map((s) => s.trim())
      : [];

  const handleAdd = () => {
    onAdd(recipe);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const staggerDelay = `${index * 55}ms`;

  return (
    <div
      className="border-b border-[#c9a84c]/10 last:border-0 relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.55s ease ${staggerDelay}, transform 0.55s ease ${staggerDelay}`,
      }}
    >
      {/* Gold left accent bar — expands when open */}
      <div
        className="absolute left-0 top-0 w-px bg-[#c9a84c] transition-all duration-500 ease-out"
        style={{ height: isOpen ? "100%" : "0%", opacity: isOpen ? 0.6 : 0 }}
      />

      {/* ── Row trigger ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 sm:gap-6 pl-3 pr-0 py-5 sm:py-6 text-left group/btn transition-all duration-300"
        aria-expanded={isOpen}
      >
        {/* Index */}
        <span
          className="text-[11px] tracking-[0.3em] w-6 flex-shrink-0 select-none transition-colors duration-300"
          style={{
            fontFamily: "var(--font-cinzel)",
            color: isOpen ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.2)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Thumbnail */}
        <div
          className="relative flex-shrink-0 overflow-hidden rounded-sm border transition-all duration-500"
          style={{
            width: isOpen ? "52px" : "40px",
            height: isOpen ? "52px" : "40px",
            borderColor: isOpen ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.1)",
          }}
        >
          <Image
            src={recipe.img}
            alt={recipe.title}
            fill
            className="object-cover transition-all duration-500"
            style={{ opacity: isOpen ? 0.95 : 0.6, transform: isOpen ? "scale(1.08)" : "scale(1.04)" }}
            sizes="52px"
          />
        </div>

        {/* Title + subtitle */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-light leading-snug truncate transition-colors duration-300"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: isOpen ? "1.25rem" : "1.1rem",
              color: isOpen ? "#c9a84c" : "#ede0c4",
              transition: "color 0.3s, font-size 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {recipe.title}
          </h3>
          <p
            className="text-[#d4c5a0]/30 text-xs font-light mt-0.5 truncate"
            style={{
              fontFamily: "var(--font-cormorant)",
              opacity: isOpen ? 0 : 1,
              maxHeight: isOpen ? 0 : "1.5rem",
              overflow: "hidden",
              transition: "opacity 0.25s ease, max-height 0.3s ease",
            }}
          >
            {ingredientList.slice(0, 4).join(" · ")}
            {ingredientList.length > 4 ? " · …" : ""}
          </p>
        </div>

        {/* Price */}
        <span
          className="tracking-[0.2em] text-[10px] uppercase flex-shrink-0 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-cinzel)",
            color: isOpen ? "#c9a84c" : "rgba(201,168,76,0.6)",
          }}
        >
          {recipe.price}
        </span>

        {/* Plus/minus icon */}
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 flex items-center justify-center border transition-all duration-350"
          style={{
            borderColor: isOpen ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1), border-color 0.3s",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4h6M4 1v6" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
          </svg>
        </div>
      </button>

      {/* ── Expandable content ── */}
      <div
        ref={contentRef}
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.48s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="pb-7 pl-3 sm:pl-4 pr-0">
          {/* Inner layout: image left, info right, CTA far right on desktop */}
          <div className="flex gap-5 sm:gap-7 items-start">

            {/* Larger reveal image */}
            <div
              className="relative flex-shrink-0 overflow-hidden rounded-sm border border-[#c9a84c]/15"
              style={{
                width: "88px",
                height: "108px",
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
              }}
            >
              <Image
                src={recipe.img}
                alt={recipe.title}
                fill
                className="object-cover opacity-80"
                sizes="88px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a]/50 to-transparent" />
            </div>

            {/* Description + ingredients */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[#d4c5a0]/55 text-sm sm:text-base leading-relaxed mb-4 font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.4s ease 0.12s, transform 0.4s ease 0.12s",
                }}
              >
                {recipe.desc}
              </p>

              {ingredientList.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-[#c9a84c]/35 tracking-[0.35em] text-[8px] uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      Zutaten
                    </span>
                    <div className="flex-1 h-px bg-[#c9a84c]/8" />
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {ingredientList.map((ing, i) => (
                      <li
                        key={ing}
                        className="text-[#d4c5a0]/55 bg-[#c9a84c]/[0.05] border border-[#c9a84c]/10 px-2 py-0.5 text-[11px] leading-relaxed"
                        style={{
                          fontFamily: "var(--font-cormorant)",
                          opacity: isOpen ? 1 : 0,
                          transform: isOpen ? "translateY(0)" : "translateY(5px)",
                          transition: `opacity 0.3s ease ${100 + i * 25}ms, transform 0.3s ease ${100 + i * 25}ms`,
                        }}
                      >
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA — inline on mobile */}
              <div
                className="mt-5"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(6px)",
                  transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                }}
              >
                <button
                  onClick={handleAdd}
                  className="relative overflow-hidden border px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase transition-all duration-400 group/add"
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    borderColor: added ? "transparent" : "rgba(201,168,76,0.45)",
                    color: added ? "#0d0c0a" : "#c9a84c",
                    backgroundColor: added ? "#c9a84c" : "transparent",
                  }}
                >
                  {!added && (
                    <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover/add:translate-y-0 transition-transform duration-350" />
                  )}
                  <span className="relative" style={{ color: added ? "#0d0c0a" : undefined }}>
                    {added ? "✓ Hinzugefügt" : (
                      <>
                        <span className="group-hover/add:hidden">Auswählen</span>
                        <span className="hidden group-hover/add:inline" style={{ color: "#0d0c0a" }}>Auswählen</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────
export default function RecipeCarousel({ onAdd }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    <section id="menu" className="py-16 sm:py-24 bg-[#0d0c0a]">

      {/* Section header */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 mb-10 sm:mb-12" ref={ref}>
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(18px)",
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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <h2
              className="text-[#ede0c4] text-4xl sm:text-5xl font-light"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Saisonal{" "}
              <em className="italic text-[#c9a84c] font-light">Empfohlen</em>
            </h2>
            <p
              className="text-[#d4c5a0]/25 text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Tippen Sie auf ein Gericht für Details
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-8 h-px"
          style={{
            background: "linear-gradient(to right, rgba(201,168,76,0.4), rgba(201,168,76,0.08), transparent)",
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease 0.25s",
          }}
        />
      </div>

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
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-red-400/70 text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
            {error}
          </p>
        </div>
      )}

      {/* Accordion */}
      {!loading && !error && (
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="border-t border-[#c9a84c]/10">
            {recipes.map((recipe, index) => (
              <AccordionItem
                key={recipe.id ?? recipe.title}
                recipe={recipe}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                onAdd={onAdd}
                inView={inView}
              />
            ))}
          </div>

          {/* Footer rule */}
          <div
            className="mt-10 flex items-center gap-5"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 0.8s ease 0.5s",
            }}
          >
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(201,168,76,0.18), transparent)" }} />
            <span
              className="text-[#c9a84c]/20 tracking-[0.35em] text-[8px] uppercase flex-shrink-0"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Frisch zubereitet an Bord
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(201,168,76,0.18), transparent)" }} />
          </div>
        </div>
      )}
    </section>
  );
}