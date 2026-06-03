"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createClient } from "app/lib/supabase/client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

// ── Easing presets ────────────────────────────────────────────────
const SILK = [0.16, 1, 0.3, 1] as const;       // fast-out, slow-in — feels expensive
const EDITORIAL = [0.25, 0.1, 0.25, 1] as const;

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
  const prefersReduced = useReducedMotion();

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

  // Panel enters from the right but also lifts slightly — more 3-D, less drawer
  const panelVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { x: "6%", opacity: 0, scale: 0.97, filter: "blur(6px)" },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: SILK },
    },
    exit: prefersReduced
      ? { opacity: 0 }
      : {
          x: "4%",
          opacity: 0,
          scale: 0.98,
          filter: "blur(4px)",
          transition: { duration: 0.35, ease: EDITORIAL },
        },
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[120] flex flex-col lg:flex-row">
        {/* Backdrop — vignette wipe instead of plain fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            relative mt-auto w-full h-[92vh] sm:mt-0 sm:ml-auto sm:w-[560px] sm:h-full
            lg:w-full lg:h-full lg:flex lg:flex-row bg-[#0d0c0a]
            border-t sm:border-t-0 sm:border-l lg:border-l-0 border-[#c9a84c]/20
            flex flex-col overflow-hidden shadow-2xl
          "
        >
          {/* Image Section */}
          <motion.div
            className="relative w-full h-[42vh] sm:h-[48vh] lg:w-1/2 lg:h-full flex-shrink-0 overflow-hidden"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.75, ease: SILK }}
          >
            <Image
              src={recipe.img}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0d0c0a]" />

            {/* Gold corner accents — draw in sequentially */}
            {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos, i) => (
              <motion.div
                key={pos}
                className={`absolute ${pos} w-10 h-10 pointer-events-none`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.4 }}
              >
                <div className={`absolute ${pos.includes("top") ? "top-0" : "bottom-0"} left-0 right-0 h-px bg-[#c9a84c]/40`} />
                <div className={`absolute top-0 bottom-0 ${pos.includes("left") ? "left-0" : "right-0"} w-px bg-[#c9a84c]/40`} />
              </motion.div>
            ))}

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.3, ease: SILK }}
              whileHover={{ scale: 1.12, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-[#c9a84c]/30 bg-[#0d0c0a]/70 text-[#c9a84c]/70 hover:text-[#c9a84c] hover:border-[#c9a84c] transition-colors backdrop-blur-sm"
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
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto lg:flex lg:items-center">
            <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-7 pb-12 lg:max-w-[580px] lg:mx-auto">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: SILK }}
                className="flex items-center gap-3 mb-4"
              >
                <motion.div
                  className="h-px bg-[#c9a84c]/60"
                  initial={{ width: 0 }}
                  animate={{ width: 20 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: SILK }}
                />
                <span className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Saison 2026
                </span>
              </motion.div>

              {/* Title — each word staggers in */}
              <div className="mb-3 overflow-hidden">
                <motion.h2
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.38, duration: 0.6, ease: SILK }}
                  className="text-[#ede0c4] text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {recipe.title}
                </motion.h2>
              </div>

              {/* Price (desktop) */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.48, duration: 0.45, ease: SILK }}
                className="hidden lg:block mb-5"
              >
                <span className="text-[#c9a84c] tracking-[0.3em] text-sm uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {recipe.price}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.55, ease: SILK }}
                className="text-[#d4c5a0]/60 text-base sm:text-lg lg:text-xl leading-relaxed font-light mb-8"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {recipe.desc}
              </motion.p>

              {/* Ingredients — spring stagger */}
              {ingredientList.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.58, duration: 0.3 }}
                  className="mb-10"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[#c9a84c]/45 tracking-[0.4em] text-[9px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Zutaten
                    </span>
                    <motion.div
                      className="flex-1 h-px bg-[#c9a84c]/10"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      style={{ originX: 0 }}
                      transition={{ delay: 0.62, duration: 0.6, ease: SILK }}
                    />
                  </div>
                  <motion.ul
                    className="flex flex-wrap gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.055, delayChildren: 0.65 },
                      },
                    }}
                  >
                    {ingredientList.map((ing) => (
                      <motion.li
                        key={ing}
                        variants={{
                          hidden: { opacity: 0, scale: 0.82, y: 10 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { type: "spring", stiffness: 380, damping: 22 },
                          },
                        }}
                        className="text-[#d4c5a0]/65 bg-[#c9a84c]/[0.06] border border-[#c9a84c]/12 px-3 py-1.5 text-sm sm:text-base"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {ing}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              )}

              {/* Add Button — fixed z-index layering */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.45, ease: SILK }}
              >
                <motion.button
                  onClick={handleAdd}
                  whileHover="hovered"
                  whileTap={{ scale: 0.97 }}
                  className="w-full relative overflow-hidden border py-5 text-[10px] sm:text-xs lg:text-sm tracking-[0.3em] uppercase transition-colors"
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    borderColor: added ? "transparent" : "rgba(201,168,76,0.5)",
                    color: added ? "#0d0c0a" : "#c9a84c",
                    backgroundColor: added ? "#c9a84c" : "transparent",
                  }}
                >
                  {/* Fill layer — now correctly behind text via z-index */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 bg-[#c9a84c] z-0"
                    variants={{
                      hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } },
                    }}
                    initial={{ scaleY: 0 }}
                    style={{ originY: "bottom" }}
                  />
                  <span className="relative z-10 pointer-events-none">
                    {added ? "✓ Zur Auswahl hinzugefügt" : `Zum Menü hinzufügen — ${recipe.price}`}
                  </span>
                </motion.button>
              </motion.div>

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
                transition={{ duration: 1, ease: SILK }}
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
            transition={{ duration: 0.8, ease: SILK }}
            className="h-px mb-8 origin-left"
            style={{ background: "linear-gradient(to right, rgba(201,168,76,0.35), rgba(201,168,76,0.06), transparent)" }}
          />

          {/* Loading — traveling shimmer line */}
          {loading && (
            <div className="flex flex-col justify-center items-center h-40 gap-6 overflow-hidden relative">
              <motion.div
                className="absolute left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent"
                animate={{ x: ["−33%", "400%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-[#c9a84c]/40 tracking-[0.4em] text-[10px] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
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
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="border-t border-[#c9a84c]/10"
            >
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id ?? recipe.title}
                  variants={{
                    hidden: { opacity: 0, x: -24, filter: "blur(3px)" },
                    visible: {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.55, ease: SILK },
                    },
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
      ? recipe.ingredients.split(",").map((s) => s.trim())
      : [];

  return (
    <motion.button
      onClick={onOpen}
      initial={false}
      whileHover="hovered"
      whileTap={{ scale: 0.99 }}
      className="w-full flex items-center gap-4 sm:gap-5 lg:gap-6 py-5 sm:py-6 lg:py-7 text-left border-b border-[#c9a84c]/10 last:border-0 group transition-all"
    >
      {/* Index number */}
      <motion.span
        variants={{ hovered: { color: "rgba(201,168,76,0.6)" } }}
        className="text-[#c9a84c]/20 text-[10px] lg:text-xs tracking-[0.3em] w-5 lg:w-6 flex-shrink-0 transition-colors"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>

      {/* Thumbnail — slides right and brightens */}
      <motion.div
        variants={{ hovered: { x: 4 } }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 flex-shrink-0 overflow-hidden border border-[#c9a84c]/10 group-hover:border-[#c9a84c]/35 transition-colors"
      >
        <motion.div
          variants={{ hovered: { scale: 1.1, opacity: 0.95 } }}
          transition={{ duration: 0.55, ease: SILK }}
          className="absolute inset-0"
        >
          <Image
            src={recipe.img}
            alt={recipe.title}
            fill
            className="object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-90"
          />
        </motion.div>
      </motion.div>

      {/* Text — title slides up slightly on hover */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <motion.p
          variants={{ hovered: { y: -2, color: "#c9a84c" } }}
          transition={{ duration: 0.25, ease: EDITORIAL }}
          className="text-[#ede0c4] text-base sm:text-xl lg:text-2xl font-light leading-snug truncate transition-colors"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {recipe.title}
        </motion.p>
        <p className="text-[#d4c5a0]/25 text-xs sm:text-sm font-light mt-0.5 truncate" style={{ fontFamily: "var(--font-cormorant)" }}>
          {ingredientList.slice(0, 5).join(" · ")}{ingredientList.length > 5 ? " · …" : ""}
        </p>
      </div>

      {/* Price */}
      <motion.span
        variants={{ hovered: { color: "#c9a84c" } }}
        className="text-[#c9a84c]/55 tracking-[0.2em] text-[10px] sm:text-xs lg:text-sm uppercase flex-shrink-0 transition-colors"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {recipe.price}
      </motion.span>

      {/* Arrow — slides right on hover */}
      <motion.div
        variants={{ hovered: { x: 3, borderColor: "rgba(201,168,76,0.45)" } }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="w-5 h-5 lg:w-7 lg:h-7 flex-shrink-0 flex items-center justify-center border border-[#c9a84c]/10 transition-colors"
      >
        <motion.svg
          variants={{ hovered: { x: 1.5, opacity: 0.75 } }}
          width="7" height="7" viewBox="0 0 7 7" fill="none"
          className="text-[#c9a84c]/30"
        >
          <path d="M1 1l3 2.5L1 6M4 3.5h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}