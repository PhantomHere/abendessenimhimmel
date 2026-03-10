"use client";
import { Recipe } from "../../page";

interface Props {
  onAdd: (recipe: Recipe) => void;
}

export default function RecipeCarousel({ onAdd }: Props) {
  const recipes: Recipe[] = [
    { title: "Rinderfilet", desc: "Mit Trüffelkruste", price: "40€", img: "/imgs/dish1.jpg" },
    { title: "Lachs-Tartar", desc: "Frischer Wildlachs", price: "25€", img: "/imgs/dish2.jpg" },
    { title: "Pasta Paradiso", desc: "Hausgemachte Pasta", price: "22€", img: "/imgs/dish3.jpg" },
    { title: "Zitronen Sorbet", desc: "Sizilianische Zitronen", price: "15€", img: "/imgs/dish4.jpg" },
    { title: "Sauerbraten", desc: "Rinderbraten in Essig-Beizen-Marinade mit Lebkuchensauce", price: "22€", img: "/imgs/dish5.jpg" },
  ];

  return (
    <section id="menu" className="py-20 bg-[#1a1a1a]">
      <div className="mx-25 mb-10">
        <h2 className="text-[#e7d8a9] text-4xl font-serif">Saisonal Empfohlen</h2>
      </div>

      <div className="flex gap-8 overflow-x-auto px-25 pb-10 scrollbar-hide snap-x snap-mandatory">
        {recipes.map((recipe, index) => (
          <div key={index} className="min-w-[320px] md:min-w-[380px] aspect-[4/5] relative group overflow-hidden rounded-2xl snap-center bg-black/40 backdrop-blur-md border border-[var(--color-gold)]/10 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-[var(--color-gold)]/30">
            <button 
              onClick={() => onAdd(recipe)}
              className="absolute top-5 right-5 z-20 bg-[var(--color-gold)]/90 text-black px-5 py-2 text-sm font-semibold rounded-full hover:bg-[var(--color-gold)] transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              + Hinzufügen
            </button>
                  
            <Image
              src={recipe.img}
              alt={recipe.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100"
              quality={75}
            />
          
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
            <div className="absolute inset-x-0 bottom-0 p-8">
              <span className="text-[var(--color-gold)] text-lg font-medium tracking-wide">{recipe.price}</span>
              <h3 className="text-[var(--color-cream)] text-3xl font-serif mt-2 mb-3">{recipe.title}</h3>
              <p className="text-[var(--color-text-dim)] text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {recipe.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}