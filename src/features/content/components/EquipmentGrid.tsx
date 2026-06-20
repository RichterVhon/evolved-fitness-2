"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  EQUIPMENT,
  EQUIPMENT_CATEGORIES,
  type Equipment,
  type EquipmentCategory,
} from "@/features/content/data/equipment";

const FILTERS: ("All" | EquipmentCategory)[] = ["All", ...EQUIPMENT_CATEGORIES];

const ENTER_TRANSITION = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
const EXIT_TRANSITION = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

function Tag({ children }: { children: string }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50 bg-white/[0.06] px-2 py-1">
      {children}
    </span>
  );
}

interface ModalState {
  item: Equipment;
  sourceRect: DOMRect;
}

export function EquipmentGrid() {
  const [activeFilter, setActiveFilter] = useState<"All" | EquipmentCategory>("All");
  const [modal, setModal] = useState<ModalState | null>(null);
  const [phase, setPhase] = useState<"entering" | "entered" | "exiting">("entering");
  const panelRef = useRef<HTMLDivElement>(null);

  const visible =
    activeFilter === "All"
      ? EQUIPMENT
      : EQUIPMENT.filter((item) => item.category === activeFilter);

  const openModal = (item: Equipment, e: React.MouseEvent<HTMLButtonElement>) => {
    setModal({ item, sourceRect: e.currentTarget.getBoundingClientRect() });
    setPhase("entering");
  };

  const closeModal = () => {
    const panel = panelRef.current;
    if (!modal || !panel) {
      setModal(null);
      return;
    }

    const finalRect = panel.getBoundingClientRect();
    const { transform } = rectToTransform(modal.sourceRect, finalRect);

    setPhase("exiting");
    panel.style.transition = EXIT_TRANSITION;
    panel.style.transform = transform;

    const onEnd = () => {
      panel.removeEventListener("transitionend", onEnd);
      setModal(null);
    };
    panel.addEventListener("transitionend", onEnd);
  };

  // Snap the panel to the clicked card's position/size, then animate to its
  // natural centered layout — a "grew from the grid" effect instead of a
  // dialog that just appears out of nowhere.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!modal || !panel || phase !== "entering") return;

    const finalRect = panel.getBoundingClientRect();
    const { transform } = rectToTransform(modal.sourceRect, finalRect);

    panel.style.transition = "none";
    panel.style.transform = transform;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.style.transition = ENTER_TRANSITION;
        panel.style.transform = "translate(0, 0) scale(1, 1)";
        setPhase("entered");
      });
    });
  }, [modal, phase]);

  useLayoutEffect(() => {
    if (!modal) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  return (
    <section className="bg-[#0d0d0d]">
      <div className="w-full px-6 lg:px-12 xl:px-20 py-16">
        {/* ── Category filters ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-5xl mx-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`text-xs font-black tracking-widest uppercase px-4 py-2 transition-colors ${
                activeFilter === filter
                  ? "bg-[#9B1C1C] text-white"
                  : "bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.1]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={(e) => openModal(item, e)}
              className="group flex flex-col h-full text-left bg-[#141414] border border-white/[0.06] hover:border-white/20 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: item.imagePosition ?? "center" }}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <p className="text-[#9B1C1C] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                  {item.category}
                </p>
                <h3 className="text-white font-black uppercase text-lg leading-tight mb-2 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                  {item.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.targetedMuscles.slice(0, 3).map((muscle) => (
                    <Tag key={muscle}>{muscle}</Tag>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Detail modal ── */}
      {modal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 transition-opacity duration-300 ${
            phase === "entering" || phase === "exiting" ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          <div
            ref={panelRef}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar bg-[#141414] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="relative flex items-center justify-center bg-black h-[55vh]">
              <Image
                src={modal.item.imageUrl}
                alt={modal.item.imageAlt ?? modal.item.name}
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                className="object-contain"
              />
            </div>

            <div className="p-8">
              <p className="text-[#9B1C1C] text-[11px] font-black tracking-[0.3em] uppercase mb-3">
                {modal.item.category}
              </p>
              <h2 className="text-white font-black uppercase text-2xl leading-tight mb-4">
                {modal.item.name}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {modal.item.fullDescription}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                    Targeted Muscles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {modal.item.targetedMuscles.map((muscle) => (
                      <Tag key={muscle}>{muscle}</Tag>
                    ))}
                  </div>
                </div>

                {modal.item.trainingFocus && modal.item.trainingFocus.length > 0 && (
                  <div>
                    <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                      Training Focus
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {modal.item.trainingFocus.map((focus) => (
                        <Tag key={focus}>{focus}</Tag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** Builds the transform that maps `to`'s box onto `from`'s box, anchored at center. */
function rectToTransform(from: DOMRect, to: DOMRect) {
  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const translateX = from.left + from.width / 2 - (to.left + to.width / 2);
  const translateY = from.top + from.height / 2 - (to.top + to.height / 2);
  return { transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})` };
}
