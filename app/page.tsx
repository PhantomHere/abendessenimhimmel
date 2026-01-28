"use client";
import { useState } from "react";
import Header_logo from "./components/hero/logo";
import Main_Menu from "./components/hero/mainMenu";
import HeroImage from "./components/hero/heroImage";
import RecipeCarousel from "./components/cards/RecipeCarousel";
import Cart from "./components/interior/cart";
import ReservationModal from "./components/cards/ReservationModal";
import AboutUs from "./components/cards/AboutUs";
import Footer from "./components/cards/footer";

//Recipe looks like
export type Recipe = {
  title: string;
  desc: string;
  price: string;
  img: string;
};

export default function Home() {
  const [isResOpen, setIsResOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Recipe[]>([]);

  const addToCart = (recipe: Recipe) => {
    setCartItems([...cartItems, recipe]);
  };

  const removeFromCart = (title: string) => {
  setCartItems(cartItems.filter((item) => item.title !== title));
};

const clearCart = () => {
  setCartItems([]);
};

  // Inside Home() in page.tsx
  return (
    <main className="min-h-screen bg-[#1a1a1a]"> 
      <Header_logo />
      <nav>
        <Main_Menu onOpenReservation={() => setIsResOpen(true)} />
      </nav>
      <HeroImage />
      <RecipeCarousel onAdd={addToCart} />
      <AboutUs />
      <Footer />
      <Cart 
        items={cartItems} 
        onRemove={removeFromCart} 
        onCheckout={() => setIsResOpen(true)} 
      />
      <ReservationModal 
        isOpen={isResOpen} 
        onClose={() => setIsResOpen(false)} 
        cartItems={cartItems} 
        onSuccess={clearCart}
      />
    </main>
  );
}
