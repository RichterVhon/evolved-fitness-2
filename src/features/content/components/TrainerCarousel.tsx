"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { TRAINERS, type Trainer } from "@/features/content/data/trainers";

const ENTER_TRANSITION = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
const EXIT_TRANSITION = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

const COUNT = TRAINERS.length;
const HALF = Math.floor(COUNT / 2);

/** Signed distance of `index` from `active`, wrapped into the range [-HALF, HALF]. */
function relativeOffset(index: number, active: number) {
  return ((index - active + HALF + COUNT) % COUNT) - HALF;
}

function cardStyle(offset: number): React.CSSProperties {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);

  if (abs === 0) {
    return {
      transform: "translate(-50%, -50%) translateX(0rem) scale(1)",
      opacity: 1,
      filter: "grayscale(0)",
      zIndex: 30,
    };
  }
  if (abs === 1) {
    return {
      transform: `translate(-50%, -50%) translateX(${sign * 9}rem) scale(0.8)`,
      opacity: 0.6,
      filter: "grayscale(1)",
      zIndex: 20,
    };
  }
  if (abs === 2) {
    return {
      transform: `translate(-50%, -50%) translateX(${sign * 16}rem) scale(0.62)`,
      opacity: 0.3,
      filter: "grayscale(1)",
      zIndex: 10,
    };
  }
  return {
    transform: `translate(-50%, -50%) translateX(${sign * 21}rem) scale(0.5)`,
    opacity: 0,
    filter: "grayscale(1)",
    zIndex: 0,
  };
}

interface ModalState {
  trainer: Trainer;
  sourceRect: DOMRect;
}

export function TrainerCarousel() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [phase, setPhase] = useState<"entering" | "entered" | "exiting">("entering");
  const panelRef = useRef<HTMLDivElement>(null);

  const goPrev = () => setActive((i) => (i - 1 + COUNT) % COUNT);
  const goNext = () => setActive((i) => (i + 1) % COUNT);

  const handleCardClick = (trainer: Trainer, index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (index !== active) {
      setActive(index);
      return;
    }
    setModal({ trainer, sourceRect: e.currentTarget.getBoundingClientRect() });
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

  const activeTrainer = TRAINERS[active];

  return (
    <section className="bg-[#0d0d0d]">
      <div className="w-full px-6 lg:px-12 xl:px-20 pt-8 pb-16">
        <div className="relative mx-auto max-w-4xl h-[400px] sm:h-[460px] lg:h-[500px] overflow-hidden">
          {/* ── Prev / Next arrows ── */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous trainer"
            className="absolute left-2 top-1/2 z-40 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next trainer"
            className="absolute right-2 top-1/2 z-40 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* ── Stacked cards ── */}
          {TRAINERS.map((trainer, index) => {
            const offset = relativeOffset(index, active);
            const isActive = offset === 0;
            return (
              <button
                key={trainer.id}
                type="button"
                onClick={(e) => handleCardClick(trainer, index, e)}
                style={cardStyle(offset)}
                className="absolute top-1/2 left-1/2 w-64 sm:w-72 lg:w-80 aspect-[3/4] overflow-hidden bg-[#141414] border border-white/10 transition-[transform,opacity,filter] duration-500 ease-out"
                aria-label={isActive ? `View ${trainer.name}'s details` : `Show ${trainer.name}`}
              >
                <Image
                  src={trainer.imageUrl}
                  alt={trainer.imageAlt ?? trainer.name}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 256px"
                  priority={isActive}
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>

        {/* ── Caption ── */}
        <div className="text-center mt-5">
          {activeTrainer.role && (
            <p className="text-[#9B1C1C] text-xs font-black tracking-[0.3em] uppercase mb-3">
              {activeTrainer.role}
            </p>
          )}
          <h3 className="text-white font-black uppercase text-2xl sm:text-3xl leading-tight">
            {activeTrainer.name}
          </h3>
          {activeTrainer.specialty && (
            <p className="text-white/50 text-base mt-2">{activeTrainer.specialty}</p>
          )}

          {/* ── Dots ── */}
          <div className="flex items-center justify-center gap-2 mt-7">
            {TRAINERS.map((trainer, index) => (
              <button
                key={trainer.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Go to ${trainer.name}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === active ? "bg-[#9B1C1C]" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
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
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar bg-[#141414] border border-white/10"
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
                src={modal.trainer.imageUrl}
                alt={modal.trainer.imageAlt ?? modal.trainer.name}
                fill
                sizes="(min-width: 768px) 32rem, 100vw"
                className="object-contain"
              />
            </div>

            <div className="p-8">
              {modal.trainer.role && (
                <p className="text-[#9B1C1C] text-[11px] font-black tracking-[0.3em] uppercase mb-3">
                  {modal.trainer.role}
                </p>
              )}
              <h2 className="text-white font-black uppercase text-2xl leading-tight mb-4">
                {modal.trainer.name}
              </h2>
              {modal.trainer.specialty && (
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {modal.trainer.specialty}
                </p>
              )}

              {(modal.trainer.phone || modal.trainer.facebookUrl) && (
                <div className="flex flex-wrap gap-3">
                  {modal.trainer.phone && (
                    <a
                      href={`tel:${modal.trainer.phone.replace(/-/g, "")}`}
                      className="text-xs font-black tracking-widest uppercase px-4 py-2 bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors"
                    >
                      {modal.trainer.phone}
                    </a>
                  )}
                  {modal.trainer.facebookUrl && (
                    <a
                      href={modal.trainer.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black tracking-widest uppercase px-4 py-2 bg-[#9B1C1C] text-white hover:bg-[#b91c1c] transition-colors"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              )}
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
