/**
 * trainers.ts
 * -----------------------------------------------------------------------
 * Single source of truth for all personal trainers shown on the landing
 * page's "Trainers" / "Meet the Coaches" section.
 *
 * WHY THIS FILE EXISTS:
 * Same principle as data/equipment.ts — content (who a trainer IS) is
 * kept separate from presentation (how they're RENDERED). Components
 * like <TrainerCarousel /> or <TrainerCard /> should only ever import
 * from here, never hardcode a trainer's name/role/contact info in JSX.
 *
 * HOW TO USE:
 *   import { TRAINERS, getTrainerById } from "@/features/content/data/trainers";
 *
 * IMAGE NOTE:
 *   `imageUrl` points to /trainers/<slug>.jpg — these files must be
 *   manually uploaded to the `public/trainers/` directory using the
 *   EXACT filename referenced below (case-sensitive on most hosts).
 *   If a trainer's photo isn't uploaded yet, the app should still
 *   render gracefully (see fallback handling note in TrainerCard).
 *
 * PRIVACY NOTE:
 *   This file contains real personal contact information (phone
 *   numbers, Facebook profile links) for real trainers, intentionally
 *   displayed per business decision. If this project is ever forked,
 *   used as a portfolio template, or its repo made public for purposes
 *   beyond the actual gym's site, reconsider whether this contact info
 *   should be redacted/replaced with placeholders first.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// TRAINER SHAPE
// ---------------------------------------------------------------------

export interface Trainer {
  /** Unique, URL-safe identifier. Used as React key + image filename match (e.g. "coach-vin" -> /trainers/coach-vin.jpg). */
  id: string;

  /** Display name as shown on the card and modal. */
  name: string;

  /**
   * Role/title at the gym (e.g. "CEO/Personal Trainer", "Fitness Trainer").
   * Optional because not every trainer has a listed title (e.g. Coach TJ's
   * source material had no role shown) — better to omit than invent one.
   */
  role?: string;

  /**
   * Optional short tagline/specialty shown as a badge on the card,
   * e.g. "Aesthetic Physique Competitor". Distinct from `role` (job title)
   * since a trainer can have both a role AND a competitive specialty.
   */
  specialty?: string;

  /** Contact phone number, displayed as-is (already formatted with dashes in source material). */
  phone?: string;

  /** Full Facebook profile URL. */
  facebookUrl?: string;

  /**
   * Path to the trainer's photo, relative to the `public/` directory.
   * Must match an actual uploaded file in public/trainers/.
   */
  imageUrl: string;

  /** Optional alt text for accessibility. Falls back to `name` if omitted. */
  imageAlt?: string;

  /**
   * Optional longer bio for the modal view. Not present in original
   * source screenshots — left undefined for now, fill in later if you
   * want richer modal content beyond contact info.
   */
  bio?: string;
}

// ---------------------------------------------------------------------
// TRAINER DATA
// ---------------------------------------------------------------------
// Order here = display order in the carousel. Reorder this array to
// reorder the carousel — no component code changes needed.

export const TRAINERS: Trainer[] = [
  {
    id: "coach-vin",
    name: "Coach Vin",
    role: "CEO / Fitness Trainer",
    phone: "0939-218-9877",
    facebookUrl: "https://www.facebook.com/marvinjoseph.kuruchanperez",
    imageUrl: "/trainers/coach-vin.jpg",
    imageAlt: "Coach Vin, CEO and Fitness Trainer at Evolve Fitness Center",
  },
  {
    id: "coach-roel",
    name: "Coach Roel",
    role: "Co-Owner / Manager / Fitness Trainer",
    phone: "0977-114-3252",
    facebookUrl: "https://www.facebook.com/Pangkoysanity",
    imageUrl: "/trainers/coach-roel.jpg",
    imageAlt: "Coach Roel, Co-Owner, Manager and Fitness Trainer at Evolve Fitness Center",
  },
  {
    id: "coach-tj",
    name: "Coach TJ",
    role: "Fitness Trainer",
    phone: "0927-408-3190",
    facebookUrl: "https://www.facebook.com/timmyjoe03",
    imageUrl: "/trainers/coach-tj.jpg",
    imageAlt: "Coach TJ, Fitness Trainer at Evolve Fitness Center",
  },
  {
    id: "coach-ejay",
    name: "Coach E-Jay",
    role: "Fitness Trainer",
    specialty: "Aesthetic Physique Competitor",
    facebookUrl: "https://www.facebook.com/eljohn.aumentado",
    imageUrl: "/trainers/coach-ejay.jpg",
    imageAlt: "Coach E-Jay, Fitness Trainer and Aesthetic Physique Competitor at Evolve Fitness Center",
  },
  {
    id: "coach-mark",
    name: "Coach Mark",
    role: "Fitness Trainer",
    imageUrl: "/trainers/coach-mark.png",
    imageAlt: "Coach Mark, Fitness Trainer at Evolve Fitness Center",
  },
];

// ---------------------------------------------------------------------
// CONVENIENCE HELPERS
// ---------------------------------------------------------------------

/** Returns a single trainer by their unique id, or undefined if not found. */
export function getTrainerById(id: string): Trainer | undefined {
  return TRAINERS.find((trainer) => trainer.id === id);
}
