import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Personal Website",
  description: "My personal website built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <CustomCursor />
        <div className="relative min-h-screen">
          <nav className="h-[var(--nav-height)] flex items-center justify-center px-4 sm:px-6 md:px-8">
            <div className="w-full flex justify-center">
              {/* <a href="/" className="hover:opacity-70 transition-opacity">Home</a>
              <a href="/about" className="hover:opacity-70 transition-opacity">About</a>
              <a href="/projects" className="hover:opacity-70 transition-opacity">Projects</a>
              <a href="/contact" className="hover:opacity-70 transition-opacity">Contact</a> */}
              <Link href="/">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-[family-name:var(--font-playfair)] z-10 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">CHRISTOPHER JAIME ARRAYA</h1>
              </Link>
            </div>
          </nav>

          <div className="border-container">
            {/* Horizontal lines */}
            <div className="border-line border-line-top-left"></div>
            <div className="border-line border-line-top-right"></div>
            <div className="border-line border-line-bottom-left"></div>
            <div className="border-line border-line-bottom-right"></div>

            {/* Vertical lines */}
            <div className="border-line border-line-left-top"></div>
            <div className="border-line border-line-left-bottom"></div>
            <div className="border-line border-line-right-top"></div>
            <div className="border-line border-line-right-bottom"></div>
          </div>

          <main className="px-[var(--border-margin)] min-h-[calc(100vh-var(--nav-height)-var(--footer-height))]">
            {children}
          </main>

          <footer className="h-[var(--footer-height)] flex items-center justify-center">
            <div
              className="footer-bg flex flex-col items-start w-[calc(100%-2*var(--border-margin))] h-full mx-[var(--border-margin)] bg-cover p-8"
              style={{
                backgroundImage: 'url("/footer-bg.png")',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold font-[family-name:var(--font-playfair)] text-blue-200 z-10">CHRISTOPHER ARRAYA</h2>

              <div className="flex gap-6 text-sm relative z-0 mt-auto mb-4 self-center">
                {/* <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">GitHub</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">LinkedIn</a>
                <span className="opacity-50">© 2024</span> */}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
