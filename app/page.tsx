"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";           // ← Added
import Header_logo from "./components/hero/logo";
import Main_Menu from "./components/hero/mainMenu";
import HeroImage from "./components/hero/heroImage";
import RecipeCarousel from "./components/cards/RecipeCarousel";
import Cart from "./components/interior/cart";
import ReservationModal from "./components/cards/ReservationModal";
import AccountModal from "./components/cards/AccountModal";
import AboutUs from "./components/cards/AboutUs";
import Footer from "./components/cards/footer";

export type Recipe = {
  id?: number;
  title: string;
  desc: string;
  price: string;
  img: string;
  ingredients?: string;
};

// Unauthorized toast with better animation
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
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-[#0d0c0a] border border-red-400/30 px-6 py-4 shadow-2xl"
    >
      <div className="w-1 h-6 bg-red-400/60 flex-shrink-0" />
      <p className="text-red-400/80 text-sm font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}>
        {toast}
      </p>
      <button onClick={() => setToast(null)} className="text-red-400/30 hover:text-red-400/60 transition-colors ml-2 text-xs">✕</button>
    </motion.div>
  );
}

export default function Home() {
  const [isResOpen, setIsResOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Recipe[]>([]);

  const addToCart = (recipe: Recipe) => setCartItems((prev) => [...prev, recipe]);

  const removeFromCart = (title: string) => {
    setCartItems((prev) => prev.filter((item) => item.title !== title));
  };

  const clearCart = () => setCartItems([]);

  return (
    <main className="min-h-screen bg-[#0d0c0a] overflow-x-hidden">
      <Suspense fallback={null}>
        <UnauthorizedToast />
      </Suspense>

      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header_logo />
      </motion.div>

      <nav>
        <Main_Menu
          onOpenReservation={() => setIsResOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />
      </nav>

      {/* Hero Section with Staggered Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        <HeroImage />
      </motion.div>

      {/* Recipe Carousel with scroll trigger */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <RecipeCarousel onAdd={addToCart} />
      </motion.div>

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
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </main>
  );
}