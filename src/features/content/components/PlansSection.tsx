"use client";

import { useState } from "react";
import {
  MEMBERSHIP_FEES,
  WALK_IN_RATES,
  getPlanBreakdown,
  getPlansByTier,
  type PricingTier,
} from "@/features/content/data/plans";

const TIERS: { value: PricingTier; label: string }[] = [
  { value: "regular", label: "Regular" },
  { value: "student", label: "Student" },
];

function peso(amount: number) {
  return `₱${amount.toLocaleString()}`;
}

export function PlansSection() {
  const [tier, setTier] = useState<PricingTier>("regular");

  const plans = getPlansByTier(tier);
  const membershipFee = MEMBERSHIP_FEES[tier];
  const walkInRates = WALK_IN_RATES.filter((rate) => rate.tier === tier);

  return (
    <section className="bg-[#0d0d0d]">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 xl:px-20 py-20">
        {/* ── Tier toggle ── */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {TIERS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={`text-xs font-black tracking-widest uppercase px-6 py-2.5 transition-colors ${
                tier === t.value
                  ? "bg-[#9B1C1C] text-white"
                  : "bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.1]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mb-12">
          One-time membership fee: <span className="text-white/70 font-semibold">{peso(membershipFee)}</span> —
          included in the 1-month plan, waived on longer plans.
        </p>

        {/* ── Promo plan cards ── */}
        <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col w-full sm:w-64 bg-[#141414] border p-8 text-center transition-colors ${
                plan.highlighted ? "border-[#9B1C1C]" : "border-white/10"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9B1C1C] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1">
                  Best Value
                </span>
              )}
              <p className="text-white/50 text-xs font-black tracking-[0.3em] uppercase mb-4">
                {plan.label}
              </p>
              <p className="text-white font-black text-4xl mb-2">
                {peso(plan.totalPrice)}
              </p>
              <p className="text-white/40 text-sm leading-relaxed">
                {getPlanBreakdown(plan)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Walk-in rates ── */}
        <div className="max-w-md mx-auto mt-14 border-t border-white/10 pt-10">
          <p className="text-center text-white/40 text-xs font-black tracking-[0.3em] uppercase mb-5">
            No membership? Walk-in rates
          </p>
          <div className="grid grid-cols-2 gap-4">
            {walkInRates.map((rate) => (
              <div
                key={rate.memberStatus}
                className="bg-white/[0.04] border border-white/10 px-5 py-4 text-center"
              >
                <p className="text-white/50 text-[10px] font-black tracking-widest uppercase mb-1">
                  {rate.memberStatus === "member" ? "Member" : "Non-Member"}
                </p>
                <p className="text-white font-black text-2xl">{peso(rate.price)}</p>
                <p className="text-white/30 text-xs mt-0.5">per visit</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
