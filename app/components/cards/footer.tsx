"use client";

import { useState } from "react";

export default function Footer() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sende...');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('Nachricht erfolgreich gesendet!');
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        setStatus('Fehler beim Senden. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      setStatus('Ein Netzwerkfehler ist aufgetreten.');
    }
  };

  return (
    <footer id="contact" className="bg-black text-white pt-20 pb-10 border-t border-[#e7d8a9]/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-25 grid md:grid-cols-2 gap-16">
        
        {/* Left Side: Brand & Info */}
        <div className="space-y-6">
          <h2 className="text-[#e7d8a9] text-3xl font-serif tracking-widest">AETHERIA DINING</h2>
          <p className="text-gray-500 max-w-sm">
            Haben Sie Fragen zu unseren Routen oder privaten Charterflügen? 
            Unser Bodenpersonal steht Ihnen jederzeit zur Verfügung.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#e7d8a9] font-bold w-20">STANDORT:</span>
              <span className="text-gray-400">Hangar 7, Berlin-Brandenburg</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#e7d8a9] font-bold w-20">FUNK:</span>
              <span className="text-gray-400">+49 (0) 30 123 456 78</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#e7d8a9] font-bold w-20">EMAIL:</span>
              <span className="text-gray-400">ground-control@aetheria.com</span>
            </div>
          </div>

          <div className="pt-8 opacity-20 select-none">
            <p className="text-6xl font-black">AIRSHIP-01</p>
            <p className="text-xs tracking-[0.5em]">LAT: 52.5200 | LON: 13.4050</p>
          </div>
        </div>

        {/*Form */}
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-white/5">
          <h3 className="text-white text-xl font-bold mb-6">Fluglogbuch: Nachricht senden</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs text-[#e7d8a9] uppercase mb-1 ml-1">Name</label>
              <input 
                id="name" 
                name="name"
                type="text" 
                required
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#e7d8a9] outline-none transition-colors"
                placeholder="Ihr Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs text-[#e7d8a9] uppercase mb-1 ml-1">Email</label>
              <input 
                id="email" 
                name="email"
                type="email" 
                required
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#e7d8a9] outline-none transition-colors"
                placeholder="name@beispiel.de"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs text-[#e7d8a9] uppercase mb-1 ml-1">Anliegen</label>
              <textarea 
                id="message" 
                name="message"
                rows={4} 
                required
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#e7d8a9] outline-none transition-colors resize-none"
                placeholder="Ihre Nachricht an uns..."
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#e7d8a9] text-black py-4 rounded font-bold hover:bg-white transition-all transform active:scale-95"
            >
              NACHRICHT ÜBERMITTELN
            </button>
            
            {status && (
              <p className="text-center text-sm text-[#e7d8a9] animate-pulse pt-2">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-25 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 tracking-widest uppercase">
        <p>© 2026 Aetheria Sky Dining. Alle Rechte vorbehalten.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Impressum</a>
          <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
          <a href="#" className="hover:text-white transition-colors">Bordregeln</a>
        </div>
      </div>
    </footer>
  );
}

