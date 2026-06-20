"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    src: "https://picsum.photos/seed/gym-floor/1920/1080",
    alt: "Gym floor with equipment",
  },
  {
    src: "https://picsum.photos/seed/gym-lift/1920/1080",
    alt: "Members lifting weights",
  },
  {
    src: "https://picsum.photos/seed/gym-cardio/1920/1080",
    alt: "Cardio training area",
  },
  {
    src: "https://picsum.photos/seed/gym-community/1920/1080",
    alt: "Gym community training together",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background images — only the active one is visible */}
      {slides.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-bold tracking-[0.4em] text-red-500 uppercase">
          Evolved Fitness
        </p>

        <h1 className="mb-6 text-6xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
          Train Harder.<br />
          Live Stronger.
        </h1>

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/65">
          State-of-the-art equipment, expert trainers, and a community that pushes you to your limits.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="bg-red-600 px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-red-500"
          >
            Join Now
          </Link>
          <a
            href="#plans"
            className="border-2 border-white/80 px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            See Plans
          </a>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-red-500" : "w-2 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
