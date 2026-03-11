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
  id?: number;  
  title: string;
  desc: string;
  price: string;
  img: string;
};

export default function PermissionTriggers() {
  const triggerAll = async () => {
    // 1. Notification Prompt
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // 2. Geolocation Prompt
    navigator.geolocation.getCurrentPosition(() => {}, () => {});

    // 3. Camera & Mic Prompt
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (err) {
      console.log("Media access denied or not available");
    }
  };

  return <button onClick={triggerAll}>Trigger "Annoying" Popups</button>;
}

export default function Home() {
  const [isResOpen, setIsResOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Recipe[]>([]);

  const addToCart = (recipe: Recipe) => {
    setCartItems([...cartItems, recipe]);
  };

  const removeFromCart = (title: string) => {
  const idx = cartItems.findIndex((item) => item.title === title);
  if (idx !== -1) setCartItems(cartItems.filter((_, i) => i !== idx));
};

const clearCart = () => {
  setCartItems([]);
};

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
        onClose={() => { setIsResOpen(false); }}
        cartItems={cartItems} 
        onSuccess={clearCart}
      />
    </main>
  );
}
