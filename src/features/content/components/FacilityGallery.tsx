"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryTile {
  images: string[];
  title?: string;
  subtitle?: string;
  feature?: boolean;
  wide?: boolean;
  comingSoon?: boolean;
  href?: string;
}

const tiles: GalleryTile[] = [
  {
    title: "Pro-Grade Equipment",
    subtitle: "Complete & well-maintained training floor",
    images: [
      "/facilities/equipment6.jpg",
      "/facilities/equipment1.jpg",
      "/facilities/equipment2.jpg",
      "/facilities/equipment3.jpg",
      "/facilities/equipment4.jpg",
      "/facilities/equipment5.jpg",
      "/facilities/equipment7.jpg",
      "/facilities/equipment8.jpg",
    ],
    feature: true,
    href: "/equipment",
  },
  {
    title: "Train in Comfort",
    subtitle: "Fully air-conditioned, every season",
    images: ["/facilities/aircon.jpg"],
  },
  {
    title: "Stay Connected",
    subtitle: "Free WiFi throughout",
    images: ["/facilities/IMG_0450.jpg"],
  },
  {
    // plain shots — no forced caption, just here because they look good
    images: [
      "/facilities/random3.jpg",
      "/facilities/random1.jpg",
      "/facilities/random4.jpg",
      "/facilities/random5.jpg",
    ],
    wide: true,
  },
  {
    title: "Easy Access",
    subtitle: "Ample on-site parking",
    images: ["/facilities/parking.jpg"],
  },
  {
    title: "Restrooms & Showers",
    subtitle: "Clean, private, and well-stocked",
    images: [
      "https://loremflickr.com/900/900/restroom",
      "https://loremflickr.com/900/900/bathroom",
    ],
  },
  {
    title: "Group Studio",
    subtitle: "Classes & sessions — coming soon",
    images: ["/facilities/comingsoon.jpg"],
    comingSoon: true,
  },
];

export function FacilityGallery() {
  const [indices, setIndices] = useState<number[]>(() => tiles.map(() => 0));

  const step = (tileIndex: number, dir: 1 | -1) => {
    setIndices((prev) => {
      const next = [...prev];
      const len = tiles[tileIndex].images.length;
      next[tileIndex] = (next[tileIndex] + dir + len) % len;
      return next;
    });
  };

  useEffect(() => {
    const timers = tiles.map((tile, i) =>
      tile.images.length > 1
        ? setInterval(() => step(i, 1), 4000)
        : undefined
    );
    return () => {
      timers.forEach((timer) => timer && clearInterval(timer));
    };
  }, []);

  return (
    <section className="bg-[#0d0d0d]">
      <div className="w-full px-4 lg:px-8 pt-12 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 grid-flow-dense auto-rows-[220px] sm:auto-rows-[260px] lg:auto-rows-[300px] gap-3">
          {tiles.map((tile, i) => {
            const hasMultiple = tile.images.length > 1;

            const tileClassName = `group relative overflow-hidden ${
              tile.feature
                ? "col-span-2 row-span-2"
                : tile.wide
                ? "col-span-2 row-span-1"
                : "col-span-1 row-span-1"
            }`;

            const tileContent = (
              <>
                <div className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105">
                  <div
                    className="flex h-full w-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${indices[i] * 100}%)` }}
                  >
                    {tile.images.map((src) =>
                      src.startsWith("/") ? (
                        <div key={src} className="relative h-full w-full flex-shrink-0">
                          <Image
                            src={src}
                            alt={tile.title ?? "Evolved Fitness Center"}
                            fill
                            sizes={tile.feature || tile.wide ? "50vw" : "25vw"}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        // external placeholder image — not under our Image optimizer config
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src}
                          src={src}
                          alt={tile.title ?? "Evolved Fitness Center"}
                          className="h-full w-full flex-shrink-0 object-cover"
                        />
                      )
                    )}
                  </div>
                </div>

                {tile.title && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.25) 55%, transparent 100%)",
                    }}
                  />
                )}

                {tile.comingSoon && (
                  <span className="absolute top-4 right-4 z-20 text-[10px] font-black tracking-widest uppercase text-white bg-[#9B1C1C] px-2.5 py-1">
                    Coming Soon
                  </span>
                )}

                {hasMultiple && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        step(i, -1);
                      }}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        step(i, 1);
                      }}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-opacity hover:bg-black/60"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>
                  </>
                )}

                {tile.title && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                    <h3
                      className={`text-white font-black uppercase leading-tight ${
                        tile.feature ? "text-2xl lg:text-3xl" : "text-lg"
                      }`}
                    >
                      {tile.title}
                    </h3>
                    {tile.subtitle && (
                      <p className="text-white/55 text-sm mt-1 leading-snug">
                        {tile.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </>
            );

            return tile.href ? (
              <Link
                key={tile.title ?? `tile-${i}`}
                href={tile.href}
                className={tileClassName}
              >
                {tileContent}
              </Link>
            ) : (
              <div key={tile.title ?? `tile-${i}`} className={tileClassName}>
                {tileContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
