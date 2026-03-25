"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header_logo from "./components/hero/logo";
import Main_Menu from "./components/hero/mainMenu";
import HeroImage from "./components/hero/heroImage";
import RecipeCarousel from "./components/cards/RecipeCarousel";
import Cart from "./components/interior/cart";
import ReservationModal from "./components/cards/ReservationModal";
import AboutUs from "./components/cards/AboutUs";
import Footer from "./components/cards/footer";

// Recipe type
export type Recipe = {
  id?: number;
  title: string;
  desc: string;
  price: string;
  img: string;
  ingredients?: string;
};

// ── Separate component so useSearchParams can be wrapped in Suspense ──
function UnauthorizedToast() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      setToast("Zugriff verweigert — Sie haben keine Admin-Berechtigung.");
      window.history.replaceState({}, "", "/");
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  if (!toast) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#0d0c0a] border border-red-400/30 px-6 py-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="w-1 h-6 bg-red-400/60 flex-shrink-0" />
      <p
        className="text-red-400/80 text-sm font-light"
        style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
      >
        {toast}
      </p>
      <button
        onClick={() => setToast(null)}
        className="text-red-400/30 hover:text-red-400/60 transition-colors ml-2 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function Home() {
  const [isResOpen, setIsResOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Recipe[]>([]);

    // The "Annoying Popup" Logic
  useEffect(() => {
    // 1. Ask for Location immediately
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }

    // 2. Ask for Mic/Camera immediately
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => stream.getTracks().forEach(track => track.stop()))
        .catch(() => {});
    }
  }, []);

  const addToCart = (recipe: Recipe) => setCartItems((prev) => [...prev, recipe]);

  const removeFromCart = (title: string) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.title === title);
      return idx !== -1 ? prev.filter((_, i) => i !== idx) : prev;
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <main className="min-h-screen bg-[#0d0c0a]">

      {/* Suspense required by Next.js for useSearchParams */}
      <Suspense fallback={null}>
        <UnauthorizedToast />
      </Suspense>

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