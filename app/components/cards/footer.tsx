"use client";
import { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SILK = [0.16, 1, 0.3, 1] as const;
const EDITORIAL = [0.25, 0.1, 0.25, 1] as const;

// ── Animated form field ───────────────────────────────────────────
function FormField({
  id,
  label,
  type = "text",
  placeholder,
  textarea = false,
  delay = 0,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  textarea?: boolean;
  delay?: number;
}) {
  const [focused, setFocused] = useState(false);
  const uid = useId();

  const sharedProps = {
    id: id || uid,
    name: id,
    required: true,
    placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      "w-full bg-transparent p-3 text-[#ede0c4] placeholder-white/15 outline-none",
    style: { fontFamily: "var(--font-cormorant)", fontSize: "16px" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: SILK }}
    >
      <label
        htmlFor={id || uid}
        className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {label}
      </label>

      {/* Border animates via framer instead of CSS transition */}
      <motion.div
        animate={{
          borderColor: focused ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.08)",
        }}
        transition={{ duration: 0.25, ease: EDITORIAL }}
        className="border"
      >
        {textarea ? (
          <textarea rows={4} {...sharedProps} className={sharedProps.className + " resize-none"} />
        ) : (
          <input type={type} {...sharedProps} />
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Footer ────────────────────────────────────────────────────────
export default function Footer() {
  const [status, setStatus] = useState("");
  const prefersReduced = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sende...");
    const formElement = e.currentTarget;

    const honeypot =
      (formElement.elements.namedItem("honeypot") as HTMLInputElement)?.value || "";
    if (honeypot) { setStatus("Spam erkannt."); return; }

    const name    = (formElement.elements.namedItem("name")    as HTMLInputElement)?.value.trim()    || "";
    const email   = (formElement.elements.namedItem("email")   as HTMLInputElement)?.value.trim()    || "";
    const message = (formElement.elements.namedItem("message") as HTMLTextAreaElement)?.value.trim() || "";

    if (!name || !email || !message) { setStatus("Bitte alle Felder ausfüllen."); return; }

    const formData = new FormData();
    formData.append("access_key", "0ebaee82-9c6d-42c0-b6a6-81821f2af4de");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("subject", `Neue Anfrage von ${name} (${email})`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) { setStatus("Nachricht erfolgreich gesendet."); formElement.reset(); }
      else { setStatus("Fehler: " + (result.message || "Service-Fehler.")); }
    } catch { setStatus("Netzwerkfehler – bitte später versuchen."); }
  };

  const contactItems = [
    { label: "Standort", value: "Hangar 7, Berlin-Brandenburg" },
    { label: "Funk",     value: "+49 (0) 30 123 456 78" },
    { label: "Email",    value: "ground-control@aetheria.com" },
  ];

  const footerLinks = ["Impressum", "Datenschutz", "Bordregeln"];

  return (
    <footer id="contact" className="bg-[#080807] border-t border-[#c9a84c]/15">

      {/* Top gold line — draws across */}
      <motion.div
        className="h-px w-full"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: SILK }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-20 mb-12 sm:mb-20">

          {/* ── Left: Brand ── */}
          <div>
            {/* Eyebrow — line draws then label fades */}
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-px bg-[#c9a84c]"
                initial={{ width: 0 }}
                whileInView={{ width: 16 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: SILK }}
              />
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 0.5, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5, ease: SILK }}
                className="text-[#c9a84c] tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Bodenpersonal
              </motion.span>
            </motion.div>

            {/* Title clips up */}
            <div className="overflow-hidden mb-5 sm:mb-6">
              <motion.h2
                initial={{ y: "105%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.65, ease: SILK }}
                className="text-[#ede0c4] text-4xl sm:text-5xl font-light leading-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Aetheria{" "}
                <em className="italic text-[#c9a84c]">Dining</em>
              </motion.h2>
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28, duration: 0.55, ease: SILK }}
              className="text-[#d4c5a0] text-base sm:text-lg font-light leading-relaxed max-w-sm mb-8 sm:mb-10"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Haben Sie Fragen zu unseren Routen oder privaten Charterflügen?
              Unser Bodenpersonal steht Ihnen jederzeit zur Verfügung.
            </motion.p>

            {/* Contact rows — stagger */}
            <motion.div
              className="space-y-4 sm:space-y-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } } }}
            >
              {contactItems.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{
                    hidden: { opacity: 0, x: -16, filter: "blur(2px)" },
                    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: SILK } },
                  }}
                  className="flex gap-4 sm:gap-6 items-baseline border-b border-white/5 pb-4 sm:pb-5"
                >
                  <span
                    className="text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase w-14 sm:w-16 flex-shrink-0"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[#d4c5a0]/50 text-sm sm:text-base font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Decorative coordinates — slow float */}
            <motion.div
              className="mt-10 sm:mt-12 opacity-10 select-none hidden sm:block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
              animate={prefersReduced ? {} : { y: [0, -5, 0] }}
              // @ts-ignore — framer transition on animate is fine
              transition2={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: "var(--font-cinzel)" }}>
                AIRSHIP-01
              </p>
              <p className="text-xs tracking-[0.4em] text-[#c9a84c] mt-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                LAT: 52.5200 · LON: 13.4050
              </p>
            </motion.div>
          </div>

          {/* ── Right: Contact form ── */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 30, scale: 0.98, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.65, ease: SILK }}
          >
            <div className="border border-[#c9a84c]/15 p-5 sm:p-8">
              <div className="overflow-hidden mb-2">
                <motion.h3
                  initial={{ y: "105%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.5, ease: SILK }}
                  className="text-[#ede0c4] text-xl sm:text-2xl font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Fluglogbuch
                </motion.h3>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.35 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, duration: 0.45 }}
                className="text-[#d4c5a0] text-base font-light mb-6 sm:mb-7"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Nachricht senden
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <FormField id="name"    label="Name"    placeholder="Ihr Name"         delay={0.48} />
                <FormField id="email"   label="Email"   type="email" placeholder="name@beispiel.de" delay={0.54} />
                <FormField id="message" label="Anliegen" placeholder="Ihre Nachricht..." textarea delay={0.60} />

                <input type="text" name="honeypot" className="hidden" aria-hidden="true" />

                {/* Submit — same scaleY wipe-from-bottom as carousel */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.68, duration: 0.45, ease: SILK }}
                >
                  <motion.button
                    type="submit"
                    whileHover="hovered"
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative overflow-hidden border border-[#c9a84c]/50 hover:border-[#c9a84c] py-4 text-[#c9a84c] tracking-[0.25em] text-[10px] uppercase transition-colors duration-300"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 bg-[#c9a84c] z-0"
                      variants={{ hovered: { scaleY: 1, transition: { duration: 0.28, ease: SILK } } }}
                      initial={{ scaleY: 0 }}
                      style={{ originY: "bottom" }}
                    />
                    <motion.span
                      className="relative z-10 block"
                      variants={{ hovered: { color: "#0d0c0a" } }}
                      transition={{ duration: 0.15 }}
                    >
                      Nachricht übermitteln
                    </motion.span>
                  </motion.button>
                </motion.div>

                {/* Status — springs in, springs out */}
                <AnimatePresence mode="wait">
                  {status && (
                    <motion.p
                      key={status}
                      initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                      animate={{ opacity: 0.7, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: EDITORIAL }}
                      className="text-center text-sm text-[#c9a84c] pt-1"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {status}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: SILK }}
          className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center"
        >
          <p
            className="text-[#d4c5a0]/20 text-[9px] tracking-[0.4em] uppercase text-center sm:text-left"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            © 2026 Aetheria Sky Dining. Alle Rechte vorbehalten.
          </p>
          <motion.div
            className="flex justify-center sm:justify-end gap-5 sm:gap-8 flex-wrap"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } } }}
          >
            {footerLinks.map((link) => (
              <motion.a
                key={link}
                href="#"
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 0.2, y: 0, transition: { duration: 0.4, ease: SILK } },
                }}
                whileHover={{ opacity: 0.6, color: "#c9a84c" }}
                className="text-[#d4c5a0] text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}