"use client";
import { useState } from "react";
import { createClient } from "app/lib/supabase/client";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "error" | "success"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setStatus({ type: "error", msg: "Bitte alle Felder ausfüllen." }); return; }
    if (password.length < 6) { setStatus({ type: "error", msg: "Passwort muss mindestens 6 Zeichen lang sein." }); return; }

    setLoading(true);
    setStatus(null);
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setStatus({ type: "error", msg: "Ungültige Anmeldedaten." }); setLoading(false); return; }
      router.push("/admin");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setStatus({ type: "error", msg: error.message }); setLoading(false); return; }
      setStatus({ type: "success", msg: "Konto erstellt! Bitte bestätigen Sie Ihre E-Mail, dann können Sie sich einloggen." });
      setMode("login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0a] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/[0.03] blur-3xl" />
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 text-[#c9a84c]/[0.025] text-[16rem] font-black leading-none select-none"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          A
        </div>
      </div>

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="inline-block mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-[#c9a84c]" />
              <span
                className="text-[#c9a84c]/60 tracking-[0.5em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Aetheria Dining
              </span>
              <div className="w-8 h-px bg-[#c9a84c]" />
            </div>
          </a>

          <h1
            className="text-[#ede0c4] text-5xl font-light mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {mode === "login" ? (
              <>Willkommen <em className="italic text-[#c9a84c]">zurück</em></>
            ) : (
              <>Konto <em className="italic text-[#c9a84c]">erstellen</em></>
            )}
          </h1>
          <p
            className="text-[#d4c5a0]/35 text-lg font-light"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {mode === "login" ? "Melden Sie sich bei Ihrem Konto an." : "Registrieren Sie sich für Zugang."}
          </p>
        </div>

        {/* Card */}
        <div className="border border-[#c9a84c]/20 bg-black/20 p-8 backdrop-blur-sm">

          {/* Mode toggle */}
          <div className="flex border border-white/8 mb-8">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setStatus(null); }}
                className={`flex-1 py-3 text-[9px] uppercase tracking-[0.25em] transition-all duration-300 ${
                  mode === m
                    ? "bg-[#c9a84c]/10 text-[#c9a84c] border-b border-[#c9a84c]"
                    : "text-white/25 hover:text-white/50"
                }`}
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {m === "login" ? "Anmelden" : "Registrieren"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label
                className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="name@beispiel.de"
                className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
              />
            </div>
            <div>
              <label
                className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-transparent border border-white/10 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
              />
            </div>
          </div>

          {/* Status message */}
          {status && (
            <p
              className={`mt-4 text-base font-light ${status.type === "error" ? "text-red-400/70" : "text-[#c9a84c]/70"}`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {status.msg}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 relative group border border-[#c9a84c]/60 hover:border-[#c9a84c] py-4 text-[#c9a84c] hover:text-[#0d0c0a] tracking-[0.25em] text-[10px] uppercase overflow-hidden transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
            <span className="relative">
              {loading ? "Bitte warten..." : mode === "login" ? "Anmelden" : "Konto erstellen"}
            </span>
          </button>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-[#d4c5a0]/25 hover:text-[#c9a84c]/60 transition-colors text-[9px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            ← Zurück zur Hauptseite
          </a>
        </div>
      </div>
    </div>
  );
}