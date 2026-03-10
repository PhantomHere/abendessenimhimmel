"use client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

export default function RecipeCarousel({ onAdd }: Props) {
  const recipes: Recipe[] = [
    { title: "Rinderfilet", desc: "Mit Trüffelkruste, Périgord-Trüffel & Jus de Veau", price: "40€", img: "/imgs/dish1.jpg" },
    { title: "Lachs-Tartar", desc: "Frischer Wildlachs, Kaviar & Blinis", price: "25€", img: "/imgs/dish2.jpg" },
    { title: "Pasta Paradiso", desc: "Hausgemachte Pasta, 36-Stunden-Ragu", price: "22€", img: "/imgs/dish3.jpg" },
    { title: "Zitronen Sorbet", desc: "Sizilianische Zitronen, Limoncello & Meringue", price: "15€", img: "/imgs/dish4.jpg" },
    { title: "Sauerbraten", desc: "Rinderbraten in Essig-Beizen-Marinade, Lebkuchensauce", price: "22€", img: "/imgs/dish5.jpg" },
  ];

  return (
    <section id="menu" className="py-28 bg-[#0d0c0a]">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-8 mb-14 flex items-end justify-between">
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
            className="text-[#ede0c4] text-5xl font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Saisonal{" "}
            <em className="italic text-[#c9a84c] font-light">Empfohlen</em>
          </h2>
        </div>
        <p
          className="text-[#d4c5a0]/40 text-sm max-w-xs text-right leading-relaxed hidden md:block"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Jedes Gericht wird in unserer Bordküche frisch zubereitet — über den Wolken Europas.
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto px-8 pb-8 scrollbar-hide snap-x snap-mandatory">
        {recipes.map((recipe, index) => (
          <article
            key={index}
            className="relative min-w-[320px] h-[480px] group overflow-hidden rounded-sm snap-center flex-shrink-0 cursor-pointer"
            style={{ background: "#111009" }}
          >
            {/* Image */}
            <div className="absolute inset-0">
              <img
                src={recipe.img}
                alt={recipe.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            </div>

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/20 to-transparent" />

            {/* Gold corner accent */}
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
              0{index + 1}
            </div>

            {/* Content */}
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
              <p
                className="text-[#d4c5a0]/50 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {recipe.desc}
              </p>

              {/* Add button */}
              <button
                onClick={() => onAdd(recipe)}
                className="mt-5 self-start border border-[#c9a84c]/50 hover:border-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d0c0a] text-[#c9a84c] px-6 py-2 text-xs tracking-[0.25em] uppercase transition-all duration-300"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Auswählen
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
