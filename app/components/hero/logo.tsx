import Image from 'next/image'
import Link from 'next/link'

export default function Header_logo() {
  return (
    <header className="relative bg-[#0d0c0a] border-b border-[#c9a84c]/20">
      {/* Top gold rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />

      <div className="container mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-col items-center gap-1">
        {/* Overline label */}
        <span
          className="text-[#c9a84c]/60 tracking-[0.4em] text-[8px] sm:text-[9px] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Since 1923
        </span>

        <Link href="/" className="block">
          <Image
            src="/imgs/logo.svg"
            alt="Aetheria Dining"
            width={180}
            height={60}
            priority
            className="h-14 sm:h-20 w-auto brightness-110 contrast-110"
          />
        </Link>

        {/* Underline label */}
        <span
          className="text-[#c9a84c]/40 tracking-[0.4em] sm:tracking-[0.6em] text-[7px] sm:text-[8px] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Haute Cuisine · 3.000m
        </span>
      </div>

      {/* Bottom gold rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent" />
    </header>
  )
}