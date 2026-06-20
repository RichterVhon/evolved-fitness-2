"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Facilities", href: "/facilities" },
  { label: "Equipment", href: "/equipment" },
  { label: "Trainers", href: "/trainers" },
  { label: "Plans", href: "/plans" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-[#0d0d0d]/95 backdrop-blur-md py-3"
          : "bg-gradient-to-b from-black/60 to-transparent py-6"
      }`}
    >
      {/* logo | nav (centered, lg+) | login/hamburger — grid keeps the nav truly centered on lg+ */}
      <div className="flex lg:grid lg:grid-cols-3 items-center justify-between px-8 lg:px-16">

        {/* ── Logo (left) ── */}
        <Link href="/" className="flex items-center gap-3 justify-self-start">
          <Image
            src="/gymlogo.jpg"
            alt="Evolved Fitness Center"
            width={56}
            height={56}
            className="rounded-full"
          />
          <div className="leading-tight hidden sm:block">
            <p className="text-white font-black text-sm tracking-widest uppercase">Evolved Fitness</p>
            <p className="text-[#9B1C1C] font-black text-[11px] tracking-widest uppercase">Center 2.0</p>
          </div>
        </Link>

        {/* ── Nav links (center, lg+ only) ── */}
        <div className="hidden lg:flex items-center justify-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-xs font-semibold tracking-widest uppercase transition-colors ${
                isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute left-1/2 -bottom-2 h-[3px] w-1.5 -translate-x-1/2 rounded-full bg-[#9B1C1C]" />
              )}
            </Link>
          ))}
        </div>

        {/* ── Login (lg+) / hamburger (below lg) ── */}
        <div className="flex items-center gap-4 justify-self-end">
          <Link
            href="/login"
            className="hidden lg:inline-block bg-[#9B1C1C] hover:bg-[#b91c1c] text-white px-6 py-2.5 text-xs font-black tracking-widest uppercase transition-colors"
          >
            Login
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="lg:hidden flex h-9 w-9 items-center justify-center text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-6 h-6">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* ── Mobile dropdown (below lg) ── */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-4 border-t border-white/10 px-8 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="bg-[#9B1C1C] hover:bg-[#b91c1c] text-white px-6 py-2.5 text-xs font-black tracking-widest uppercase text-center transition-colors"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
