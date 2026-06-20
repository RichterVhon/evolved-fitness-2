import { PageHeader } from "@/features/content/components/PageHeader";
import { PlansSection } from "@/features/content/components/PlansSection";
import { Footer } from "@/features/content/components/Footer";

export default function PlansPage() {
  return (
    <main>
      <PageHeader
        title="Plans & Pricing"
        subtitle="One-time membership fee, then pick a plan that fits how long you're training with us."
        image="/facilities/IMG_0457.jpg"
      />
      <PlansSection />
      <Footer />
    </main>
  );
}
