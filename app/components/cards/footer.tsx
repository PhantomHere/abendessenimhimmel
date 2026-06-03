"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SILK = [0.16, 1, 0.3, 1] as const;

const CONTACT_ITEMS = [
  { label: "Standort", value: "Hangar 7, Berlin-Brandenburg" },
  { label: "Funk",     value: "+49 (0) 30 123 456 78"       },
  { label: "Email",    value: "ground-control@aetheria.com"  },
];

const FIELDS = [
  { id: "name",  label: "Name",  type: "text",  placeholder: "Ihr Name"          },
  { id: "email", label: "Email", type: "email", placeholder: "name@beispiel.de"  },
];

// ── Animated input field ─────────────────────────────────────────
function Field({
  id, label, type, placeholder, delay,
}: {
  id: string; label: string; type: string; placeholder: string; delay: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: SILK }}
    >
      <label
        htmlFor={id}
        className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          required
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border border-white/8 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
        />
        {/* Gold focus underline — draws in from left */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-[#c9a84c]/70 pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.35, ease: SILK }}
        />
      </div>
    </motion.div>
  );
}

export default function Footer() {
  const [status, setStatus] = useState("");
  const prefersReduced = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sende...");
    const form = e.currentTarget;

    const honeypot = (form.elements.namedItem("honeypot") as HTMLInputElement)?.value || "";
    if (honeypot) { setStatus("Spam erkannt."); return; }

    const name    = (form.elements.namedItem("name")    as HTMLInputElement)?.value.trim()    || "";
    const email   = (form.elements.namedItem("email")   as HTMLInputElement)?.value.trim()    || "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value.trim() || "";

    if (!name || !email || !message) { setStatus("Bitte alle Felder ausfüllen."); return; }

    const fd = new FormData();
    fd.append("access_key", "0ebaee82-9c6d-42c0-b6a6-81821f2af4de");
    fd.append("name", name);
    fd.append("email", email);
    fd.append("message", message);
    fd.append("subject", `Neue Anfrage von ${name} (${email})`);

    try {
      const res  = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) { setStatus("Nachricht erfolgreich gesendet."); form.reset(); }
      else              { setStatus("Fehler: " + (data.message || "Service-Fehler.")); }
    } catch { setStatus("Netzwerkfehler – bitte später versuchen."); }
  };

  // Shared entrance variant for both columns
  const colVariants = {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(4px)" },
    visible: (delay: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.7, ease: SILK, delay },
    }),
  };

  return (
    <footer id="contact" className="bg-[#080807] border-t border-[#c9a84c]/15">

      {/* Top gold line — draws in on mount */}
      <motion.div
        className="h-px w-full"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: SILK }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-20 mb-12 sm:mb-20">

          {/* ── Left: Brand ──────────────────────────────────────── */}
          <motion.div
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="h-px bg-[#c9a84c]"
                initial={{ width: 0 }}
                whileInView={{ width: 16 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: SILK, delay: 0.2 }}
              />
              <span
                className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Bodenpersonal
              </span>
            </div>

            {/* Title — slides up from clip */}
            <div className="overflow-hidden mb-5 sm:mb-6">
              <motion.h2
                className="text-[#ede0c4] text-4xl sm:text-5xl font-light leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
                initial={{ y: "110%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, ease: SILK, delay: 0.25 }}
              >
                Aetheria{" "}
                <em className="italic text-[#c9a84c]">Dining</em>
              </motion.h2>
            </div>

            <motion.p
              className="text-[#d4c5a0]/40 text-base sm:text-lg font-light leading-relaxed max-w-sm mb-8 sm:mb-10"
              style={{ fontFamily: "var(--font-cormorant)" }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: SILK, delay: 0.35 }}
            >
              Haben Sie Fragen zu unseren Routen oder privaten Charterflügen?
              Unser Bodenpersonal steht Ihnen jederzeit zur Verfügung.
            </motion.p>

            {/* Contact rows — each line wipes in */}
            <div className="space-y-0">
              {CONTACT_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: SILK, delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 sm:gap-6 items-baseline border-b border-white/5 pb-4 sm:pb-5 pt-4 sm:pt-5 first:pt-0 group/row"
                >
                  {/* Animated left accent */}
                  <motion.div
                    className="absolute h-full w-px bg-[#c9a84c]/0 group-hover/row:bg-[#c9a84c]/20 transition-colors duration-300"
                    style={{ left: 0 }}
                  />
                  <span
                    className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase w-14 sm:w-16 flex-shrink-0"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[#d4c5a0]/50 text-sm sm:text-base font-light group-hover/row:text-[#d4c5a0]/70 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Decorative coordinates */}
            <motion.div
              className="mt-10 sm:mt-12 opacity-10 select-none hidden sm:block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <p className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "var(--font-cinzel)" }}>
                AIRSHIP-01
              </p>
              <p className="text-xs tracking-[0.4em] text-[#c9a84c] mt-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                LAT: 52.5200 · LON: 13.4050
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right: Contact form ───────────────────────────────── */}
          <motion.div
            variants={colVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.25}
          >
            <motion.div
              className="border border-[#c9a84c]/15 p-5 sm:p-8"
              whileHover={{ borderColor: "rgba(201,168,76,0.25)" }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3
                className="text-[#ede0c4] text-xl sm:text-2xl font-light mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: SILK, delay: 0.3 }}
              >
                Fluglogbuch
              </motion.h3>
              <motion.p
                className="text-[#d4c5a0]/35 text-base font-light mb-6 sm:mb-7"
                style={{ fontFamily: "var(--font-cormorant)" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Nachricht senden
              </motion.p>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {FIELDS.map((f, i) => (
                  <Field key={f.id} {...f} delay={0.38 + i * 0.08} />
                ))}

                {/* Textarea with same focus treatment */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.54, duration: 0.5, ease: SILK }}
                >
                  <TextareaField />
                </motion.div>

                <input type="text" name="honeypot" className="hidden" aria-hidden="true" />

                {/* Submit button — scaleY wipe from bottom (consistent with menu button) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.62, duration: 0.45, ease: SILK }}
                >
                  <motion.button
                    type="submit"
                    whileHover="hovered"
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative overflow-hidden border border-[#c9a84c]/50 hover:border-[#c9a84c] py-4 text-[#c9a84c] tracking-[0.25em] text-[10px] uppercase transition-colors"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 bg-[#c9a84c] z-0"
                      variants={{
                        hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } },
                      }}
                      initial={{ scaleY: 0 }}
                      style={{ originY: "bottom" }}
                    />
                    <motion.span
                      className="relative z-10 pointer-events-none"
                      variants={{ hovered: { color: "#0d0c0a" } }}
                      transition={{ duration: 0.15 }}
                    >
                      Nachricht übermitteln
                    </motion.span>
                  </motion.button>
                </motion.div>

                {/* Status — springs in */}
                <AnimatePresence mode="wait">
                  {status && (
                    <motion.p
                      key={status}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="text-center text-sm text-[#c9a84c]/70 pt-1"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {status}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <motion.div
          className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p
            className="text-[#d4c5a0]/20 text-[9px] tracking-[0.4em] uppercase text-center sm:text-left"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            © 2026 Aetheria Sky Dining. Alle Rechte vorbehalten.
          </p>
          <div className="flex justify-center sm:justify-end gap-5 sm:gap-8 flex-wrap">
            {["Impressum", "Datenschutz", "Bordregeln"].map((link, i) => (
              <motion.a
                key={link}
                href="#"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.07, duration: 0.4, ease: SILK }}
                whileHover={{ y: -2, color: "rgba(201,168,76,0.65)" }}
                className="text-[#d4c5a0]/20 transition-colors text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

// ── Textarea with animated focus underline ───────────────────────
function TextareaField() {
  const [focused, setFocused] = useState(false);
  const SILK = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      <label
        htmlFor="message"
        className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        Anliegen
      </label>
      <div className="relative">
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Ihre Nachricht..."
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border border-white/8 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors resize-none"
          style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-[#c9a84c]/70 pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.35, ease: SILK }}
        />
      </div>
    </>
  );
}