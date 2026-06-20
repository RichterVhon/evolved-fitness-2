/**
 * plans.ts
 * -----------------------------------------------------------------------
 * Single source of truth for all pricing shown on the landing page's
 * "Plans" / "Gym Rates" section.
 *
 * WHY THIS FILE EXISTS:
 * Same separation-of-concerns principle as data/equipment.ts and
 * data/trainers.ts — pricing numbers live here, display logic lives in
 * components. Components must import from here, never hardcode a peso
 * amount directly in JSX.
 *
 * IMPORTANT CONTEXT — READ BEFORE EDITING:
 * The gym's pricing has THREE separate offerings that look independent
 * on the printed rate card, but two of them are mathematically related:
 *
 *   1. WALK_IN_RATES   — pay-per-visit, no membership required at all.
 *   2. MEMBERSHIP_FEES — a ONE-TIME fee required to become a member.
 *                         This is what unlocks member pricing (cheaper
 *                         walk-in rates) and is the base cost baked into
 *                         every monthly/promo plan below.
 *   3. PROMO_PLANS     — time-based plans (1 month / 6 months / 1 year).
 *                         Each plan's displayed price is actually
 *                         (membership fee + duration cost), OR, for the
 *                         6-month and 1-year plans, the membership fee
 *                         is WAIVED entirely ("plus FREE membership" on
 *                         the original rate card).
 *
 * This was verified against the source rate card: for both the Student
 * and Regular tiers, the 1-month promo price equals exactly
 * (membership fee + ₱800). That ₱800 is the implicit base monthly rate,
 * confirmed below as `BASE_MONTHLY_RATE`. We store the fee and the rate
 * as separate numbers (not just the final bundled total) specifically
 * so the UI can show the breakdown transparently, e.g.:
 *   "₱1,000 membership + ₱800/mo = ₱1,800"
 * rather than displaying an opaque total with no explanation. If the
 * gym changes the membership fee or monthly rate, update ONE number
 * here — do not hand-edit the bundled totals in PROMO_PLANS.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// SHARED TYPES
// ---------------------------------------------------------------------

/** The two pricing tiers used throughout the rate card. */
export type PricingTier = "student" | "regular";

/** Whether someone already holds a membership, for walk-in pricing. */
export type MemberStatus = "member" | "non-member";

/**
 * How a plan's membership fee is handled:
 * - "included": the fee is bundled into the plan's price (e.g. 1-month promos)
 * - "waived":   the fee is dropped entirely, free with this plan (e.g. 6mo/1yr promos)
 *
 * Modeled as a union instead of a boolean (e.g. `isFree: boolean`) because
 * a boolean can't distinguish "fee included in the price you pay" from
 * "fee waived/free" — those need different copy on the UI
 * ("includes ₱1,000 membership" vs. "membership fee waived").
 */
export type MembershipFeeHandling = "included" | "waived";

// ---------------------------------------------------------------------
// 1. WALK-IN RATES
// ---------------------------------------------------------------------
// Modeled as a flat array of rows (not 4 separate named fields) so that
// adding a new tier or member status later means adding one object, not
// editing the interface AND every component that reads these fields.

export interface WalkInRate {
  memberStatus: MemberStatus;
  tier: PricingTier;
  price: number;
}

export const WALK_IN_RATES: WalkInRate[] = [
  { memberStatus: "member", tier: "student", price: 80 },
  { memberStatus: "non-member", tier: "student", price: 100 },
  { memberStatus: "member", tier: "regular", price: 100 },
  { memberStatus: "non-member", tier: "regular", price: 150 },
];

/** Convenience lookup: get a single walk-in rate by member status + tier. */
export function getWalkInRate(
  memberStatus: MemberStatus,
  tier: PricingTier
): number | undefined {
  return WALK_IN_RATES.find(
    (rate) => rate.memberStatus === memberStatus && rate.tier === tier
  )?.price;
}

// ---------------------------------------------------------------------
// 2. MEMBERSHIP FEE (one-time)
// ---------------------------------------------------------------------
// This is the core fact the website needs to be able to explain clearly:
// joining as a member requires a ONE-TIME fee, separate from any
// ongoing monthly cost. Every promo plan below references these values
// rather than duplicating the number.

export const MEMBERSHIP_FEES: Record<PricingTier, number> = {
  student: 1000,
  regular: 1400,
};

/**
 * The implicit base monthly rate, derived from the rate card's bundled
 * promo prices (see file header for the verification math). Stored
 * explicitly so it's a named, traceable value rather than a magic
 * number buried inside a bundled total.
 */
export const BASE_MONTHLY_RATE = 800;

// ---------------------------------------------------------------------
// 3. PROMO PLANS (time-based packages)
// ---------------------------------------------------------------------

export interface PromoPlan {
  /** Unique, URL-safe identifier. */
  id: string;

  /** Display label, e.g. "1 Month", "6 Months", "1 Year". */
  label: string;

  /** Which pricing tier this specific plan row applies to. */
  tier: PricingTier;

  /** Duration of the plan, in months. Used for display and any future "per month" math. */
  durationMonths: number;

  /** Final price the member actually pays for this plan. */
  totalPrice: number;

  /** How the membership fee factors into totalPrice — see MembershipFeeHandling above. */
  membershipFeeHandling: MembershipFeeHandling;

  /**
   * Optional flag to visually highlight a plan as the best value
   * (e.g. "Most Popular" / "Best Value" badge). Not present in the
   * original rate card — left false for all by default; set manually
   * if the gym wants to promote a specific plan.
   */
  highlighted?: boolean;
}

export const PROMO_PLANS: PromoPlan[] = [
  {
    id: "student-1-month",
    label: "1 Month",
    tier: "student",
    durationMonths: 1,
    totalPrice: 1800, // = MEMBERSHIP_FEES.student (1000) + BASE_MONTHLY_RATE (800)
    membershipFeeHandling: "included",
  },
  {
    id: "regular-1-month",
    label: "1 Month",
    tier: "regular",
    durationMonths: 1,
    totalPrice: 2200, // = MEMBERSHIP_FEES.regular (1400) + BASE_MONTHLY_RATE (800)
    membershipFeeHandling: "included",
  },
  {
    id: "regular-6-months",
    label: "6 Months",
    tier: "regular",
    durationMonths: 6,
    totalPrice: 8000, // membership fee WAIVED — flat bundled price per rate card
    membershipFeeHandling: "waived",
    highlighted: true,
  },
  {
    id: "regular-1-year",
    label: "1 Year",
    tier: "regular",
    durationMonths: 12,
    totalPrice: 12000, // membership fee WAIVED — flat bundled price per rate card
    membershipFeeHandling: "waived",
    highlighted: true,
  },
];

/**
 * Builds a human-readable breakdown string for a promo plan, e.g.
 * "₱1,000 membership + ₱800/mo" or "Membership fee waived".
 *
 * Centralizing this here (rather than re-deriving it inside a component)
 * means every place that needs breakdown copy says the exact same thing,
 * and the peso-formatting logic only lives in one place.
 */
export function getPlanBreakdown(plan: PromoPlan): string {
  if (plan.membershipFeeHandling === "waived") {
    return "Membership fee waived";
  }
  const fee = MEMBERSHIP_FEES[plan.tier];
  return `\u20b1${fee.toLocaleString()} membership + \u20b1${BASE_MONTHLY_RATE.toLocaleString()}/mo`;
}

/** Returns all promo plans for a given tier, in the order they should display. */
export function getPlansByTier(tier: PricingTier): PromoPlan[] {
  return PROMO_PLANS.filter((plan) => plan.tier === tier);
}
