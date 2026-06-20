/**
 * equipment.ts
 * -----------------------------------------------------------------------
 * Single source of truth for all gym equipment shown on the landing page's
 * "Equipment" section.
 *
 * WHY THIS FILE EXISTS (read this if you're new to the pattern):
 * Content (what an item IS) is kept separate from presentation (how it's
 * RENDERED). Components like <EquipmentGrid /> or <EquipmentCard /> should
 * only ever import from here — they should never hardcode equipment names,
 * descriptions, or muscle groups directly in JSX. This means:
 *   1. Updating equipment info never requires touching component code.
 *   2. Adding a new machine = adding one object to the array below.
 *   3. TypeScript's `Equipment` interface guarantees every item has every
 *      required field — a typo or missing field fails the BUILD, not
 *      silently breaks the UI at runtime.
 *
 * HOW TO USE:
 *   import { EQUIPMENT, EquipmentCategory } from "@/features/content/data/equipment";
 *
 * IMAGE NOTE:
 *   `imageUrl` points to real photos in `public/equipments/`. Most photos
 *   are tall (portrait) gym-floor shots cropped into a 4:3 card — when the
 *   equipment itself sits in the lower or upper part of the frame (rather
 *   than dead-center), set `imagePosition` to a CSS `object-position`
 *   keyword (e.g. "bottom", "top") so the crop keeps the equipment in view
 *   instead of the ceiling lights or bare floor.
 * -----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// CATEGORY DEFINITIONS
// ---------------------------------------------------------------------
// Using a TypeScript union type (instead of raw strings scattered around
// the codebase) means autocomplete works, typos are caught at compile
// time, and renaming a category is a single find-and-replace.

export type EquipmentCategory =
  | "Free Weights"
  | "Functional & Accessories"
  | "Benches & Racks"
  | "Cable & Pulley Machines"
  | "Selectorized Strength Machines"
  | "Cardio";

// Ordered list of categories, used to render filter tabs/chips in a
// predictable, intentional order (not whatever order objects happen to
// appear in the array below).
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "Free Weights",
  "Functional & Accessories",
  "Benches & Racks",
  "Cable & Pulley Machines",
  "Selectorized Strength Machines",
  "Cardio",
];

// ---------------------------------------------------------------------
// EQUIPMENT SHAPE
// ---------------------------------------------------------------------

export interface Equipment {
  /** Unique, URL-safe identifier. Used as React key + modal deep-link (e.g. ?equipment=barbells). */
  id: string;

  /** Display name shown on the card and modal title. */
  name: string;

  /** Category this item belongs to. Must be one of EquipmentCategory. */
  category: EquipmentCategory;

  /** 1 short sentence. Shown on the CARD (grid view). Keep under ~90 characters so cards stay uniform height. */
  shortDescription: string;

  /** 2-4 sentences. Shown in the MODAL (detail view) only. Can be longer/more technical. */
  fullDescription: string;

  /** Primary muscle groups targeted. Shown as tags/chips on both card and modal. */
  targetedMuscles: string[];

  /** Optional: training benefit tags, e.g. "Strength", "Hypertrophy", "Mobility", "Cardio". Useful for future filtering. */
  trainingFocus?: string[];

  /** Photo path under `public/`. Keep 1:1 or 4:3 aspect ratio assets for grid consistency. */
  imageUrl: string;

  /** Optional alt text for accessibility. Falls back to `name` if omitted — but writing one explicitly is best practice. */
  imageAlt?: string;

  /** Optional CSS object-position keyword (e.g. "top", "bottom") for photos where the subject isn't centered. Defaults to "center". */
  imagePosition?: string;
}

// ---------------------------------------------------------------------
// EQUIPMENT DATA
// ---------------------------------------------------------------------

export const EQUIPMENT: Equipment[] = [
  // ===================== FREE WEIGHTS =====================
  {
    id: "dumbbells",
    name: "Dumbbells",
    category: "Free Weights",
    shortDescription: "Versatile handheld weights for unilateral and bilateral training.",
    fullDescription:
      "Fixed-weight dumbbells available across a wide range of increments, allowing lifters to isolate muscles, correct strength imbalances between limbs, and perform a huge variety of pressing, pulling, and rotational movements. A staple of nearly every strength program, from beginner to advanced.",
    targetedMuscles: ["Chest", "Shoulders", "Arms", "Back", "Legs"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/dumbbell.jpg",
    imageAlt: "A rack of fixed-weight dumbbells",
  },
  {
    id: "plates",
    name: "Weight Plates",
    category: "Free Weights",
    shortDescription: "Standard iron/rubber plates used to load barbells and loadable equipment.",
    fullDescription:
      "Olympic or standard weight plates used to add resistance to barbells, plate-loaded machines, and loadable dumbbells. Available in a range of weights to allow precise, incremental progressive overload.",
    targetedMuscles: ["Full Body"],
    trainingFocus: ["Strength"],
    imageUrl: "/equipments/plates.jpg",
    imageAlt: "Stacked Olympic weight plates",
  },
  {
    id: "barbells",
    name: "Barbells",
    category: "Free Weights",
    shortDescription: "Long bars used with plates for the foundational compound lifts.",
    fullDescription:
      "The core tool for compound strength movements like squats, deadlifts, bench presses, and rows. Barbell training allows for the heaviest loading of any free-weight modality and is foundational to most strength and powerlifting programs.",
    targetedMuscles: ["Full Body"],
    trainingFocus: ["Strength"],
    imageUrl: "/equipments/barbell.jpg",
    imageAlt: "An Olympic barbell on a rack",
  },
  {
    id: "kettlebells",
    name: "Kettlebells",
    category: "Free Weights",
    shortDescription: "Ball-shaped weights with a handle, ideal for dynamic, ballistic movement.",
    fullDescription:
      "Kettlebells shift the center of mass away from the hand, making them ideal for ballistic and dynamic movements like swings, snatches, and cleans. They build grip strength, core stability, and explosive power in ways traditional dumbbells don't.",
    targetedMuscles: ["Glutes", "Core", "Shoulders", "Back"],
    trainingFocus: ["Strength", "Cardio", "Mobility"],
    imageUrl: "/equipments/kettlebell.jpg",
    imageAlt: "A row of cast iron kettlebells",
  },
  {
    id: "loadable-dumbbells",
    name: "Loadable Dumbbells",
    category: "Free Weights",
    shortDescription: "Adjustable dumbbells that accept plates for customizable resistance.",
    fullDescription:
      "Unlike fixed dumbbells, loadable dumbbells feature a handle that accepts standard plates, allowing lifters to fine-tune resistance in small increments. A space-efficient option that bridges the gap between fixed dumbbells and barbell training.",
    targetedMuscles: ["Chest", "Shoulders", "Arms", "Back"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/loadable-dumbbell.jpg",
    imageAlt: "An adjustable, plate-loadable dumbbell handle",
  },

  // ===================== FUNCTIONAL & ACCESSORIES =====================
  {
    id: "mats",
    name: "Exercise Mats",
    category: "Functional & Accessories",
    shortDescription: "Cushioned mats for floor exercises, stretching, and core work.",
    fullDescription:
      "Provide cushioning and grip for floor-based exercises such as stretching, bodyweight training, and core work. Essential for comfort and joint protection during mobility and recovery routines.",
    targetedMuscles: ["Core", "Full Body"],
    trainingFocus: ["Mobility", "Recovery"],
    imageUrl: "/equipments/exercise-mat.jpg",
    imageAlt: "Rolled exercise mats",
  },
  {
    id: "ab-roller",
    name: "Ab Roller",
    category: "Functional & Accessories",
    shortDescription: "Wheel device that challenges core stability through extension.",
    fullDescription:
      "A simple wheel with handles used to perform rollouts — an advanced core exercise that demands significant anti-extension strength from the abdominals and stabilizing muscles. Effective for building a strong, functional core.",
    targetedMuscles: ["Core", "Abs", "Shoulders"],
    trainingFocus: ["Strength", "Core Stability"],
    imageUrl: "/equipments/ab-roller.jpg",
    imageAlt: "An ab roller wheel with two handles",
  },
  {
    id: "yoga-balls",
    name: "Yoga / Stability Balls",
    category: "Functional & Accessories",
    shortDescription: "Inflatable balls used for balance, core, and stretching work.",
    fullDescription:
      "Large inflatable balls used to add an instability element to exercises, forcing greater core engagement. Commonly used for stability training, stretching, and physiotherapy-style rehabilitation movements.",
    targetedMuscles: ["Core", "Lower Back"],
    trainingFocus: ["Mobility", "Core Stability"],
    imageUrl: "/equipments/yoga-ball.jpg",
    imageAlt: "Stability balls in various colors",
  },
  {
    id: "medicine-ball",
    name: "Medicine Ball",
    category: "Functional & Accessories",
    shortDescription: "Weighted ball used for explosive, full-body power training.",
    fullDescription:
      "A weighted ball used for slams, throws, and rotational exercises that develop explosive power and core strength. Popular in functional and athletic conditioning programs.",
    targetedMuscles: ["Core", "Shoulders", "Full Body"],
    trainingFocus: ["Strength", "Cardio"],
    imageUrl: "/equipments/med-ball.png",
    imageAlt: "A weighted medicine ball",
  },

  // ===================== BENCHES & RACKS =====================
  {
    id: "bench-press",
    name: "Bench Press",
    category: "Benches & Racks",
    shortDescription: "Flat bench used with a barbell or dumbbells for chest pressing.",
    fullDescription:
      "A flat, sturdy bench paired with a barbell rack or used freestanding for dumbbell pressing. The foundation for chest-focused pressing movements and a core lift in most upper-body strength programs.",
    targetedMuscles: ["Chest", "Triceps", "Shoulders"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/benchpress.jpg",
    imageAlt: "A flat weight bench with barbell rack",
    imagePosition: "bottom",
  },
  {
    id: "incline-bench-press",
    name: "Incline Bench Press",
    category: "Benches & Racks",
    shortDescription: "Angled bench that shifts emphasis to the upper chest and shoulders.",
    fullDescription:
      "Similar to the flat bench press but set at an incline (typically 15-45 degrees), shifting more emphasis onto the upper chest (clavicular head of the pectorals) and anterior deltoids.",
    targetedMuscles: ["Upper Chest", "Shoulders", "Triceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/incline-bench-press.jpg",
    imageAlt: "An adjustable incline weight bench",
    imagePosition: "bottom",
  },
  {
    id: "power-rack-smith-machine",
    name: "Commercial Power Rack + Smith Machine",
    category: "Benches & Racks",
    shortDescription: "Combo rack offering free-weight safety and guided barbell training.",
    fullDescription:
      "A heavy-duty commercial rack combining a traditional power rack (with adjustable safety bars for squats, presses, and pull-ups) and a Smith machine, where the barbell travels along a fixed vertical track. Offers both free-weight versatility and guided-movement safety in one station.",
    targetedMuscles: ["Full Body", "Legs", "Back", "Chest"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/commercial-power-rack.jpg",
    imageAlt: "A commercial power rack combined with a Smith machine",
  },
  {
    id: "adjustable-bench",
    name: "Adjustable Bench",
    category: "Benches & Racks",
    shortDescription: "Multi-angle bench that adjusts from flat to fully upright.",
    fullDescription:
      "A versatile bench with multiple back-pad angles, from flat through incline to a fully upright seated position. Pairs with dumbbells, barbells, or cable attachments to train the chest, shoulders, and back from different angles without needing a dedicated machine for each.",
    targetedMuscles: ["Chest", "Shoulders", "Back"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/adjustable-bench.jpg",
    imageAlt: "An adjustable incline weight bench",
  },
  {
    id: "seated-bench",
    name: "Seated Bench",
    category: "Benches & Racks",
    shortDescription: "Upright bench with back support for stabilized seated exercises.",
    fullDescription:
      "A fixed, upright bench with a contoured backrest that keeps the torso stable during seated exercises. Commonly used for seated dumbbell curls, shoulder work, and other isolation movements where eliminating body sway improves form and muscle focus.",
    targetedMuscles: ["Shoulders", "Arms", "Core"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/seated-bench.jpg",
    imageAlt: "An upright seated bench with backrest",
  },
  {
    id: "flat-bench",
    name: "Flat Bench",
    category: "Benches & Racks",
    shortDescription: "Simple, sturdy flat bench for pressing, rows, and supported exercises.",
    fullDescription:
      "A no-frills flat bench built for stability under heavy loads. The foundation for flat dumbbell or barbell presses, single-arm rows, and a wide range of supported accessory movements where a fixed, level surface is all that's needed.",
    targetedMuscles: ["Chest", "Back", "Arms"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/bench-flat.jpg",
    imageAlt: "A flat weight bench",
  },

  // ===================== CABLE & PULLEY MACHINES =====================
  {
    id: "cable-machine",
    name: "Cable Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Adjustable pulley system for constant-tension, multi-angle exercises.",
    fullDescription:
      "A versatile pulley-based machine with adjustable height settings, allowing for constant muscle tension throughout an exercise's full range of motion. Supports countless exercises for nearly every muscle group via interchangeable attachments.",
    targetedMuscles: ["Full Body"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/cable-machine.jpg",
    imageAlt: "A dual-adjustable cable pulley machine",
    imagePosition: "top",
  },
  {
    id: "lat-pulldown-low-row",
    name: "Lat Pulldown & Low Row Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Combo station for vertical and horizontal pulling, with bar and V attachments.",
    fullDescription:
      "A combination station offering both a high pulldown for vertical pulling (targeting the lats) and a low row position for horizontal pulling (targeting the mid-back). Comes equipped with both straight bar and V-bar attachments to vary grip width and angle.",
    targetedMuscles: ["Lats", "Back", "Biceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/lat-pulldown-machine.jpg",
    imageAlt: "A lat pulldown and low row combination machine",
  },
  {
    id: "multi-function-press",
    name: "Multi-Function Press Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Adjustable press station supporting multiple pressing angles and exercises.",
    fullDescription:
      "A versatile, adjustable press machine that allows users to switch between chest, shoulder, and incline pressing angles on a single station, maximizing exercise variety in a compact footprint.",
    targetedMuscles: ["Chest", "Shoulders", "Triceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/multi-function-press.jpg",
    imageAlt: "A multi-function adjustable press machine",
  },
  {
    id: "chest-press-lat-pulldown",
    name: "Chest Press + Lat Pulldown Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Dual-station machine combining horizontal pressing and vertical pulling.",
    fullDescription:
      "A space-efficient dual-function machine offering a seated chest press on one side and a lat pulldown on the other, allowing facilities to provide two distinct movement patterns in a single footprint.",
    targetedMuscles: ["Chest", "Lats", "Triceps", "Back"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/lat-pulldown-chest-press.jpg",
    imageAlt: "A combination chest press and lat pulldown machine",
    imagePosition: "bottom",
  },
  {
    id: "standing-multi-flight",
    name: "Standing Multi Flight Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Standing, weight-stack station for a variety of pulling and pressing exercises.",
    fullDescription:
      "A standing, weight-stack-based pulley station designed for exercises requiring an upright, athletic stance — such as standing rows, presses, and rotational movements. Engages stabilizer muscles more than seated alternatives.",
    targetedMuscles: ["Back", "Shoulders", "Core"],
    trainingFocus: ["Strength", "Core Stability"],
    imageUrl: "/equipments/standing-multi-flight.jpg",
    imageAlt: "A standing multi-flight cable machine",
  },
  {
    id: "linear-row-machine",
    name: "Linear Row Machine",
    category: "Cable & Pulley Machines",
    shortDescription: "Seated row machine with a fixed, linear pulling path for back development.",
    fullDescription:
      "A seated rowing machine guiding the handles along a fixed, linear path, isolating the back and biceps with a controlled, consistent movement pattern that's especially beginner-friendly.",
    targetedMuscles: ["Back", "Lats", "Biceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/linear-row-machine.jpg",
    imageAlt: "A linear seated row machine",
  },

  // ===================== SELECTORIZED STRENGTH MACHINES =====================
  {
    id: "seated-rowing-machine",
    name: "Seated Rowing Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Selectorized machine isolating the back through a seated rowing motion.",
    fullDescription:
      "A weight-stack machine that isolates the muscles of the back through a controlled, seated rowing motion. Offers a safer, more guided alternative to free-weight rows for building back thickness.",
    targetedMuscles: ["Back", "Lats", "Biceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/seated-rowing-machine.jpg",
    imageAlt: "A selectorized seated rowing machine",
    imagePosition: "bottom",
  },
  {
    id: "leg-press-hack-squat",
    name: "Leg Press + Hack Squat Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Combo machine for heavy, guided lower-body pressing movements.",
    fullDescription:
      "A dual-function plate-loaded machine offering both a leg press (seated, angled pressing) and hack squat (guided squat pattern with back support) on a single frame. Allows safe, heavy lower-body loading without requiring a spotter.",
    targetedMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/leg-press-machine.jpg",
    imageAlt: "A combination leg press and hack squat machine",
    imagePosition: "bottom",
  },
  {
    id: "leg-extension-hamstring-curl",
    name: "Leg Extension + Hamstring Curl Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Combo machine isolating quads and hamstrings through single-joint movement.",
    fullDescription:
      "A dual-function machine combining leg extensions (isolating the quadriceps) and hamstring curls (isolating the hamstrings, seated or lying) on one frame, allowing focused, single-joint development of the upper legs.",
    targetedMuscles: ["Quadriceps", "Hamstrings"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/leg-extension-hamstring-curl.jpg",
    imageAlt: "A combination leg extension and hamstring curl machine",
    imagePosition: "bottom",
  },
  {
    id: "adductor-abductor-machine",
    name: "Adductor / Abductor Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Seated machine targeting the inner and outer thigh muscles.",
    fullDescription:
      "A seated machine that isolates the hip adductors (inner thigh) and abductors (outer thigh) through controlled inward and outward leg movement against resistance. Commonly used for hip stability and lower-body symmetry.",
    targetedMuscles: ["Inner Thighs", "Outer Thighs", "Hips"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/adductor-abductor.jpg",
    imageAlt: "A seated hip adductor and abductor machine",
  },
  {
    id: "pec-deck-fly",
    name: "Pec Deck Fly Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Seated machine isolating the chest through a fly motion.",
    fullDescription:
      "A seated machine that isolates the pectoral muscles through a controlled fly motion, bringing the arms together in front of the chest. A staple isolation exercise for chest development without involving the triceps as heavily as pressing movements.",
    targetedMuscles: ["Chest"],
    trainingFocus: ["Hypertrophy"],
    imageUrl: "/equipments/pec-deck-machine.jpg",
    imageAlt: "A seated pec deck fly machine",
  },
  {
    id: "hip-thrust-machine",
    name: "Hip Thrust Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Purpose-built machine for loaded hip thrusts targeting the glutes.",
    fullDescription:
      "A dedicated machine designed to safely load the hip thrust movement pattern, which is widely regarded as one of the most effective exercises for glute development. Removes the setup difficulty and discomfort of barbell hip thrusts on a bench.",
    targetedMuscles: ["Glutes", "Hamstrings"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/hip-thrust.jpg",
    imageAlt: "A dedicated hip thrust machine",
    imagePosition: "bottom",
  },
  {
    id: "incline-shoulder-press",
    name: "Incline Shoulder Press Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Selectorized machine for guided, angled shoulder pressing.",
    fullDescription:
      "A seated, plate-loaded or weight-stack machine that guides the user through a shoulder pressing motion at a fixed, supportive angle, reducing strain on the lower back compared to standing free-weight presses.",
    targetedMuscles: ["Shoulders", "Triceps"],
    trainingFocus: ["Strength", "Hypertrophy"],
    imageUrl: "/equipments/incline-shoulder-press.jpg",
    imageAlt: "A selectorized incline shoulder press machine",
    imagePosition: "bottom",
  },
  {
    id: "machine-seated-calf-raise",
    name: "Machine Seated Calf Raise",
    category: "Selectorized Strength Machines",
    shortDescription: "Seated machine isolating the calves through ankle extension.",
    fullDescription:
      "A seated machine that loads the calves directly through repeated ankle extension (plantarflexion) against resistance pads placed on the knees. Targets the soleus muscle in particular due to the bent-knee position.",
    targetedMuscles: ["Calves"],
    trainingFocus: ["Hypertrophy"],
    imageUrl: "/equipments/seated-calf-raise.jpg",
    imageAlt: "A seated calf raise machine",
  },
  {
    id: "back-extension-machine",
    name: "Back Extension Machine",
    category: "Selectorized Strength Machines",
    shortDescription: "Machine for strengthening the lower back through controlled extension.",
    fullDescription:
      "A machine (or bench) that positions the body to perform controlled hip and lower-back extension, strengthening the erector spinae muscles. Important for posture, lower-back resilience, and injury prevention.",
    targetedMuscles: ["Lower Back", "Glutes", "Hamstrings"],
    trainingFocus: ["Strength", "Mobility"],
    imageUrl: "/equipments/back-extension.jpg",
    imageAlt: "A back extension machine",
  },

  // ===================== CARDIO =====================
  {
    id: "indoor-cycling-bike",
    name: "Indoor Cycling Bike",
    category: "Cardio",
    shortDescription: "Stationary bike for high-intensity and endurance cardio training.",
    fullDescription:
      "A stationary bike designed for both steady-state endurance work and high-intensity interval training (HIIT). Adjustable resistance allows users to simulate climbs, sprints, and recovery rides for low-impact cardiovascular conditioning.",
    targetedMuscles: ["Quadriceps", "Hamstrings", "Calves", "Cardiovascular System"],
    trainingFocus: ["Cardio", "Endurance"],
    imageUrl: "/equipments/indoor-cycling.jpg",
    imageAlt: "An indoor stationary cycling bike",
  },
  {
    id: "curved-treadmill",
    name: "Non-Motorized Curved Treadmill",
    category: "Cardio",
    shortDescription: "Self-powered curved treadmill driven entirely by the user's stride.",
    fullDescription:
      "A manually-powered treadmill with a curved running surface, requiring no motor — the belt moves entirely from the user's own stride force. This increases muscle engagement and naturally encourages proper running form, while allowing instant speed changes without buttons.",
    targetedMuscles: ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Cardiovascular System"],
    trainingFocus: ["Cardio", "Endurance"],
    imageUrl: "/equipments/non-motorized-curved-treadmill.jpg",
    imageAlt: "A non-motorized curved treadmill",
    imagePosition: "bottom",
  },
];

// ---------------------------------------------------------------------
// CONVENIENCE HELPERS
// ---------------------------------------------------------------------
// Small, pure utility functions co-located with the data they operate on.
// Keeping these here (rather than scattered in components) means every
// component queries equipment data the SAME way — one source of truth
// for "how do I get equipment by category" logic, not five different
// .filter() calls copy-pasted across files.

/** Returns all equipment items belonging to a given category. */
export function getEquipmentByCategory(category: EquipmentCategory): Equipment[] {
  return EQUIPMENT.filter((item) => item.category === category);
}

/** Returns a single equipment item by its unique id, or undefined if not found. */
export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT.find((item) => item.id === id);
}
