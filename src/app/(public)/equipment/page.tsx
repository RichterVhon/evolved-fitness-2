import { PageHeader } from "@/features/content/components/PageHeader";
import { EquipmentGrid } from "@/features/content/components/EquipmentGrid";
import { Footer } from "@/features/content/components/Footer";

export default function EquipmentPage() {
  return (
    <main>
      <PageHeader
        title="Our Equipment"
        subtitle="Free weights, machines, and cardio gear for every stage of training."
        image="/facilities/IMG_0465.jpg"
      />
      <EquipmentGrid />
      <Footer />
    </main>
  );
}
