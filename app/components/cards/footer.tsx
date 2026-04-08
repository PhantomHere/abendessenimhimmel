"use client";
import { useState } from "react";

export default function Footer() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sende...');
    const formElement = e.currentTarget;

    const honeypot = (formElement.elements.namedItem('honeypot') as HTMLInputElement)?.value || '';
    if (honeypot) { setStatus('Spam erkannt.'); return; }

    const name = (formElement.elements.namedItem('name') as HTMLInputElement)?.value.trim() || '';
    const email = (formElement.elements.namedItem('email') as HTMLInputElement)?.value.trim() || '';
    const message = (formElement.elements.namedItem('message') as HTMLTextAreaElement)?.value.trim() || '';

    if (!name || !email || !message) { setStatus('Bitte alle Felder ausfüllen.'); return; }

    const formData = new FormData();
    formData.append('access_key', '0ebaee82-9c6d-42c0-b6a6-81821f2af4de');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('subject', `Neue Anfrage von ${name} (${email})`);

    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) { setStatus('Nachricht erfolgreich gesendet.'); formElement.reset(); }
      else { setStatus('Fehler: ' + (result.message || 'Service-Fehler.')); }
    } catch { setStatus('Netzwerkfehler – bitte später versuchen.'); }
  };

  return (
    <footer id="contact" className="bg-[#080807] border-t border-[#c9a84c]/15">

      {/* Top gold line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">

        <div className="grid md:grid-cols-2 gap-12 sm:gap-20 mb-12 sm:mb-20">

          {/* Left: Brand */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-4 h-px bg-[#c9a84c]" />
              <span
                className="text-[#c9a84c]/50 tracking-[0.4em] text-[9px] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Bodenpersonal
              </span>
            </div>

            <h2
              className="text-[#ede0c4] text-4xl sm:text-5xl font-light mb-5 sm:mb-6 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Aetheria{" "}
              <em className="italic text-[#c9a84c]">Dining</em>
            </h2>

            <p
              className="text-[#d4c5a0]/40 text-base sm:text-lg font-light leading-relaxed max-w-sm mb-8 sm:mb-10"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Haben Sie Fragen zu unseren Routen oder privaten Charterflügen?
              Unser Bodenpersonal steht Ihnen jederzeit zur Verfügung.
            </p>

            {/* Contact details */}
            <div className="space-y-4 sm:space-y-5">
              {[
                { label: "Standort", value: "Hangar 7, Berlin-Brandenburg" },
                { label: "Funk", value: "+49 (0) 30 123 456 78" },
                { label: "Email", value: "ground-control@aetheria.com" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4 sm:gap-6 items-baseline border-b border-white/5 pb-4 sm:pb-5">
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
                </div>
              ))}
            </div>

            {/* Decorative coordinates — hide on very small screens */}
            <div className="mt-10 sm:mt-12 opacity-10 select-none hidden sm:block">
              <p
                className="text-4xl sm:text-5xl font-black text-white"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                AIRSHIP-01
              </p>
              <p
                className="text-xs tracking-[0.4em] text-[#c9a84c] mt-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                LAT: 52.5200 · LON: 13.4050
              </p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <div className="border border-[#c9a84c]/15 p-5 sm:p-8">
              <h3
                className="text-[#ede0c4] text-xl sm:text-2xl font-light mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Fluglogbuch
              </h3>
              <p
                className="text-[#d4c5a0]/35 text-base font-light mb-6 sm:mb-7"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Nachricht senden
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Ihr Name" },
                  { id: "email", label: "Email", type: "email", placeholder: "name@beispiel.de" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      className="w-full bg-transparent border border-white/8 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors"
                      style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[#c9a84c]/50 tracking-[0.3em] text-[9px] uppercase mb-2"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Anliegen
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Ihre Nachricht..."
                    className="w-full bg-transparent border border-white/8 focus:border-[#c9a84c]/50 p-3 text-[#ede0c4] placeholder-white/15 outline-none transition-colors resize-none"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px" }}
                  />
                </div>

                <input type="text" name="honeypot" className="hidden" aria-hidden="true" />

                <button
                  type="submit"
                  className="w-full relative group border border-[#c9a84c]/50 hover:border-[#c9a84c] py-4 text-[#c9a84c] hover:text-[#0d0c0a] tracking-[0.25em] text-[10px] uppercase overflow-hidden transition-all duration-500"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  <span className="absolute inset-0 bg-[#c9a84c] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  <span className="relative">Nachricht übermitteln</span>
                </button>

                {status && (
                  <p
                    className="text-center text-sm text-[#c9a84c]/70 pt-1"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <p
            className="text-[#d4c5a0]/20 text-[9px] tracking-[0.4em] uppercase text-center sm:text-left"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            © 2026 Aetheria Sky Dining. Alle Rechte vorbehalten.
          </p>
          <div className="flex justify-center sm:justify-end gap-5 sm:gap-8 flex-wrap">
            {["Impressum", "Datenschutz", "Bordregeln"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[#d4c5a0]/20 hover:text-[#c9a84c]/60 transition-colors text-[9px] tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}