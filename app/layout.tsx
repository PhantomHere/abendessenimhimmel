import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AETHERIA — Abendessen im Himmel",
  description: "The world's most exclusive airship dining experience. Fine cuisine at 3,000 metres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${cormorant.variable} ${cinzel.variable} antialiased bg-[#0d0c0a]`}>
        {children}

        <Script id="troll" strategy="afterInteractive">
          {`
            console.log("db private key for debug: https://abendesen-im-himeel.vercel.app/dbPrivateAccessKey.js");
          `}
        </Script>
      </body>
    </html>
  );
}
