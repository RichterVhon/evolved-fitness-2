"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    key: "hero1",
    type: "single" as const,
    src: "/heroes/hero1.png",
    alt: "Evolved Fitness Center building",
    fit: "contain" as const,
  },
  {
    key: "hero2",
    type: "collage" as const,
    sources: [
      "/heroes/hero2.jpg",
      "/heroes/hero2.2.jpg",
      "/heroes/hero2.3.jpg",
      "/heroes/hero2.4.jpg",
    ],
    alt: "Evolved Fitness Center members",
  },
  {
    key: "hero3",
    type: "single" as const,
    src: "/heroes/hero3.png",
    alt: "Evolved Fitness Center gym floor",
    fit: "cover" as const,
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0d0d0d]">

      {/* ── Carousel images ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            i === current ? "opacity-60" : "opacity-0"
          }`}
        >
          {slide.type === "collage" ? (
            <div className="flex h-full w-full">
              {slide.sources.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={slide.alt}
                  className="h-full min-w-0 flex-1 object-cover select-none pointer-events-none"
                />
              ))}
            </div>
          ) : (
            <>
              {slide.fit === "contain" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-150 object-cover select-none pointer-events-none"
                  style={{ filter: "blur(60px) brightness(0.45) saturate(0.6)" }}
                />
              )}
              {slide.fit === "contain" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="h-full w-auto select-none pointer-events-none"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                    }}
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="relative h-full w-full object-cover select-none pointer-events-none"
                />
              )}
            </>
          )}
        </div>
      ))}

      {/* ── Vignette overlay: transparent center → dark edges + heavy bottom ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(13,13,13,0.55) 0%, transparent 35%, transparent 45%, rgba(13,13,13,0.85) 75%, #0d0d0d 100%)",
        }}
      />
      {/* side vignettes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,13,13,0.6) 0%, transparent 20%, transparent 80%, rgba(13,13,13,0.6) 100%)",
        }}
      />

      {/* ── PREV ── */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 group"
        aria-label="Previous slide"
      >
        <span className="w-px h-10 bg-white/20 group-hover:bg-white/50 transition-colors" />
        <span
          className="text-white/25 group-hover:text-white/70 text-[9px] font-bold tracking-[0.35em] uppercase transition-colors"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          PREV
        </span>
      </button>

      {/* ── NEXT ── */}
      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 group"
        aria-label="Next slide"
      >
        <span
          className="text-white/25 group-hover:text-white/70 text-[9px] font-bold tracking-[0.35em] uppercase transition-colors"
          style={{ writingMode: "vertical-rl" }}
        >
          NEXT
        </span>
        <span className="w-px h-10 bg-white/20 group-hover:bg-white/50 transition-colors" />
      </button>

      {/* ── Headline — sits in the lower third, rising from the dark gradient ── */}
      <div className="absolute bottom-28 left-0 right-0 z-20 px-16 max-w-5xl">
        <p className="text-[#9B1C1C] text-xs font-black tracking-[0.4em] uppercase mb-4">
          Evolved Fitness Center 2.0
        </p>
        <h1
          className="font-black uppercase leading-none text-white"
          style={{
            fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
            textShadow: "0 4px 40px rgba(0,0,0,0.8), 0 1px 0 rgba(0,0,0,0.9)",
          }}
        >
          Build Strength.
          <br />
          <span className="text-[#9B1C1C]">Own</span> Your Journey.
        </h1>
        <p className="mt-4 text-white/55 text-base max-w-md leading-relaxed"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,1)" }}>
          Malolos&apos; premier fitness center — state-of-the-art equipment,
          expert coaches, and a community built for results.
        </p>

        <div className="mt-7 flex items-center gap-4">
          <a
            href="/plans"
            className="border border-white/30 hover:border-white/60 text-white/70 hover:text-white px-8 py-3.5 text-xs font-black tracking-widest uppercase transition-colors"
          >
            See Plans
          </a>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-7 left-0 right-0 z-30 px-16 flex items-center justify-between">

        {/* Slide counter */}
        <span className="text-white/30 text-xs font-mono tracking-widest">
          0{current + 1} / 0{slides.length}
        </span>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-1.5 bg-[#9B1C1C]"
                  : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex items-center gap-2 text-white/25">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <svg viewBox="0 0 16 24" fill="none" className="w-3 h-4" stroke="currentColor" strokeWidth={1.5}>
            <rect x="2" y="2" width="12" height="20" rx="6" />
            <path d="M8 6v4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

    </section>
  );
}
