"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

// ── Isolated card component — each manages its own flip state ──
function RecipeCard({
  recipe,
  index,
  onAdd,
}: {
  recipe: Recipe;
  index: number;
  onAdd: (recipe: Recipe) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  const ingredientList: string[] =
    Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : typeof recipe.ingredients === "string" && recipe.ingredients.trim()
      ? recipe.ingredients.split(",").map((s) => s.trim())
      : [];

  return (
    <div
      style={{ perspective: "900px", height: "460px" }}
      // Desktop: hover to flip
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      // Mobile: tap to flip
      onClick={() => setFlipped((f) => !f)}
    >
      {/* Flip container */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >

        {/* ── FRONT FACE ── */}
        <article
          className="absolute inset-0 overflow-hidden rounded-sm cursor-pointer bg-[#111009]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0">
            <Image
              src={recipe.img}
              alt={recipe.title}
              fill
              className="object-cover opacity-60 transition-opacity duration-700 ease-out"
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index <= 1}
            />
          </div>

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/20 to-transparent" />

          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-px bg-[#c9a84c]/40" />
            <div className="absolute top-0 left-0 h-full w-px bg-[#c9a84c]/40" />
          </div>
          <div className="absolute top-0 right-0 w-12 h-12">
            <div className="absolute top-0 right-0 w-full h-px bg-[#c9a84c]/40" />
            <div className="absolute top-0 right-0 h-full w-px bg-[#c9a84c]/40" />
          </div>

          {/* Index number */}
          <div
            className="absolute top-5 left-0 right-0 flex justify-center text-[#c9a84c]/20 text-6xl font-light select-none pointer-events-none"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Tap hint on mobile */}
          <div className="absolute top-5 right-5 sm:hidden">
            <span
              className="text-[#c9a84c]/40 tracking-[0.2em] text-[8px] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Tippen
            </span>
          </div>

          {/* Title + price */}
          <div className="absolute inset-0 flex flex-col justify-end p-7">
            <span
              className="text-[#c9a84c] tracking-[0.35em] text-[10px] uppercase mb-3 block"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {recipe.price}
            </span>
            <h3
              className="text-[#ede0c4] text-3xl font-light mb-2 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {recipe.title}
            </h3>
          </div>
        </article>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 rounded-sm bg-[#0f0d0b] border border-[#c9a84c]/25 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="border-b border-[#c9a84c]/20 px-6 pt-6 pb-5">
            <span
              className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase block mb-1"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {recipe.price}
            </span>
            <h3
              className="text-[#ede0c4] text-2xl font-light italic leading-snug"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {recipe.title}
            </h3>
          </div>

          {/* Ingredients + description */}
          <div className="flex-1 overflow-hidden px-6 py-4">
            {ingredientList.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[#c9a84c]/50 tracking-[0.4em] text-[8px] uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Zutaten
                  </span>
                  <div className="flex-1 h-px bg-[#c9a84c]/15" />
                </div>
                <ul className="flex flex-wrap gap-1.5 mb-4">
                  {ingredientList.map((ing) => (
                    <li
                      key={ing}
                      className="text-[#d4c5a0]/75 bg-[#c9a84c]/[0.07] border border-[#c9a84c]/15 px-2.5 py-0.5 leading-relaxed"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "0.8rem" }}
                    >
                      {ing}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p
              className="text-[#d4c5a0]/50 leading-relaxed"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "0.9rem" }}
            >
              {recipe.desc}
            </p>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 border-t border-[#c9a84c]/20 pt-4 flex items-center justify-between">
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(recipe); }}
              className="border border-[#c9a84c]/50 hover:border-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d0c0a] text-[#c9a84c] px-6 py-2.5 text-xs tracking-[0.25em] uppercase transition-all duration-300 active:bg-[#c9a84c] active:text-[#0d0c0a]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Auswählen
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              className="sm:hidden text-[#d4c5a0]/30 text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ✕
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main carousel ──
export default function RecipeCarousel({ onAdd }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section id="menu" className="py-16 sm:py-28 bg-[#0d0c0a]">

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 sm:mb-14">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#c9a84c]" />
              <span
                className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Saison 2026
              </span>
            </div>
            <h2
              className="text-[#ede0c4] text-4xl sm:text-5xl font-light"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Saisonal{" "}
              <em className="italic text-[#c9a84c] font-light">Empfohlen</em>
            </h2>
          </div>
        </div>
        <p
          className="text-[#d4c5a0]/40 text-sm max-w-xs leading-relaxed mt-3 sm:hidden"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Tippen Sie auf eine Karte, um Details zu sehen.
        </p>
        <p
          className="text-[#d4c5a0]/40 text-sm max-w-xs text-right leading-relaxed hidden md:block"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Jedes Gericht wird in unserer Bordküche frisch zubereitet — über den Wolken Europas.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-48 gap-4">
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

      {/* Error state */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <p
            className="text-red-400/70 text-lg font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id ?? recipe.title}
              recipe={recipe}
              index={index}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}

    </section>
  );
}