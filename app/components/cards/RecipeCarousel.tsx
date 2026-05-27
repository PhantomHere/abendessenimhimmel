"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
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
  const [added, setAdded] = useState(false);

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

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[120] flex flex-col lg:flex-row">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Main Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ 
            x: "100%", 
            opacity: 0,
            transition: { duration: 0.45, ease: [0.4, 0, 1, 1] }   // Smooth & luxurious close
          }}
          transition={{ 
            duration: 0.55, 
            ease: [0.25, 0.1, 0.25, 1] 
          }}
          className="
            relative mt-auto w-full h-[92vh] sm:mt-0 sm:ml-auto sm:w-[560px] sm:h-full
            lg:w-full lg:h-full lg:flex lg:flex-row bg-[#0d0c0a]
            border-t sm:border-t-0 sm:border-l lg:border-l-0 border-[#c9a84c]/20
            flex flex-col overflow-hidden shadow-2xl
          "
        >
          {/* Image Section */}
          <div className="relative w-full h-[42vh] sm:h-[48vh] lg:w-1/2 lg:h-full flex-shrink-0 overflow-hidden">
            <Image
              src={recipe.img}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0d0c0a]" />

            {/* Gold corner accents */}
            {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
              <div key={pos} className={`absolute ${pos} w-10 h-10 pointer-events-none`}>
                <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} left-0 right-0 h-px bg-[#c9a84c]/40`} />
                <div className={`absolute top-0 bottom-0 ${pos.includes("left") ? "left-0" : "right-0"} w-px bg-[#c9a84c]/40`} />
              </div>
            ))}

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-[#c9a84c]/30 bg-[#0d0c0a]/70 text-[#c9a84c]/70 hover:text-[#c9a84c] hover:border-[#c9a84c] transition-all backdrop-blur-sm"
            >
              <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </motion.button>

            <div className="absolute bottom-6 left-6 lg:hidden">
              <span className="text-[#c9a84c] tracking-[0.3em] text-sm uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                {recipe.price}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto lg:flex lg:items-center">
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-7 pb-12 lg:max-w-[580px] lg:mx-auto">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-5 h-px bg-[#c9a84c]/60" />
                <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Saison 2026
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[#ede0c4] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-3"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {recipe.title}
              </motion.h2>

              {/* Price (desktop) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:block mb-5"
              >
                <span className="text-[#c9a84c] tracking-[0.3em] text-sm uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {recipe.price}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-[#d4c5a0]/60 text-base sm:text-lg lg:text-xl leading-relaxed font-light mb-8"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {recipe.desc}
              </motion.p>

              {/* Ingredients */}
              {ingredientList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mb-10"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#c9a84c]/45 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Zutaten
                    </span>
                    <div className="flex-1 h-px bg-[#c9a84c]/08" />
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {ingredientList.map((ing, i) => (
                      <motion.li
                        key={ing}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                        className="text-[#d4c5a0]/65 bg-[#c9a84c]/[0.06] border border-[#c9a84c]/12 px-3 py-1.5 text-sm sm:text-base"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {ing}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Add Button */}
              <motion.button
                onClick={handleAdd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden border py-5 text-[10px] sm:text-xs lg:text-sm tracking-[0.3em] uppercase transition-all group/add"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  borderColor: added ? "transparent" : "rgba(201,168,76,0.5)",
                  color: added ? "#0d0c0a" : "#c9a84c",
                  backgroundColor: added ? "#c9a84c" : "transparent",
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-[#c9a84c]"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                />
                <span className="relative z-10">
                  {added ? "✓ Zur Auswahl hinzugefügt" : `Zum Menü hinzufügen — ${recipe.price}`}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ── Main Component ───────────────────────────────────────────────────
export default function RecipeCarousel({ onAdd }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setError("Speisekarte konnte nicht geladen werden.");
        console.error(error);
      } else {
        setRecipes(data as Recipe[]);
      }
      setLoading(false);
    };
    fetchRecipes();
  }, []);

  return (
    <>
      <section id="menu" className="py-16 sm:py-24 lg:py-32 bg-[#0d0c0a]">
        <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 32 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="h-px bg-[#c9a84c]"
              />
              <span className="text-[#c9a84c]/60 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                Saison 2026
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <h2 className="text-[#ede0c4] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                Saisonal <em className="italic text-[#c9a84c]">Empfohlen</em>
              </h2>
              <p className="text-[#d4c5a0]/25 text-xs sm:text-sm" style={{ fontFamily: "var(--font-cormorant)" }}>
                Klicken für Details
              </p>
            </div>
          </motion.div>

          {/* Top Rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-px mb-8 origin-left"
            style={{ background: "linear-gradient(to right, rgba(201,168,76,0.35), rgba(201,168,76,0.06), transparent)" }}
          />

          {loading && (
            <div className="flex justify-center items-center h-40 gap-4">
              <div className="w-4 h-px bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[10px] uppercase animate-pulse" style={{ fontFamily: "var(--font-cinzel)" }}>
                Speisekarte wird geladen
              </span>
            </div>
          )}

          {error && (
            <p className="text-red-400/70 text-lg font-light text-center mt-8" style={{ fontFamily: "var(--font-cormorant)" }}>
              {error}
            </p>
          )}

          {!loading && !error && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="border-t border-[#c9a84c]/10"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id ?? recipe.title}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 }
                  }}
                >
                  <MenuRow
                    recipe={recipe}
                    index={index}
                    onOpen={() => setActiveRecipe(recipe)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex items-center gap-5"
          >
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(201,168,76,0.15), transparent)" }} />
            <span className="text-[#c9a84c]/20 tracking-[0.35em] text-[8px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Frisch zubereitet an Bord
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, rgba(201,168,76,0.15), transparent)" }} />
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {activeRecipe && (
          <DishDetail
            recipe={activeRecipe}
            onClose={() => setActiveRecipe(null)}
            onAdd={onAdd}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Compact Menu Row ──────────────────────────────────────────────
function MenuRow({
  recipe,
  index,
  onOpen,
}: {
  recipe: Recipe;
  index: number;
  onOpen: () => void;
}) {
  const ingredientList: string[] = 
    typeof recipe.ingredients === "string" 
      ? recipe.ingredients.split(",").map(s => s.trim())
      : [];

  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ x: 8 }}
      className="w-full flex items-center gap-4 sm:gap-5 lg:gap-6 py-5 sm:py-6 lg:py-7 text-left border-b border-[#c9a84c]/10 last:border-0 group transition-all"
    >
      <span className="text-[#c9a84c]/20 text-[10px] lg:text-xs tracking-[0.3em] w-5 lg:w-6 flex-shrink-0 group-hover:text-[#c9a84c]/50 transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 flex-shrink-0 overflow-hidden border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/35 transition-all">
        <Image
          src={recipe.img}
          alt={recipe.title}
          fill
          className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#ede0c4] text-base sm:text-xl lg:text-2xl font-light leading-snug truncate group-hover:text-[#c9a84c] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
          {recipe.title}
        </p>
        <p className="text-[#d4c5a0]/25 text-xs sm:text-sm font-light mt-0.5 truncate" style={{ fontFamily: "var(--font-cormorant)" }}>
          {ingredientList.slice(0, 5).join(" · ")}{ingredientList.length > 5 ? " · …" : ""}
        </p>
      </div>

      <span className="text-[#c9a84c]/55 tracking-[0.2em] text-[10px] sm:text-xs lg:text-sm uppercase flex-shrink-0 group-hover:text-[#c9a84c] transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>
        {recipe.price}
      </span>

      <div className="w-5 h-5 lg:w-7 lg:h-7 flex-shrink-0 flex items-center justify-center border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/40 transition-all">
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" className="text-[#c9a84c]/30 group-hover:text-[#c9a84c]/70 transition-colors">
          <path d="M1 1l3 2.5L1 6M4 3.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.button>
  );
}