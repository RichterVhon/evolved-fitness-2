import { PageHeader } from "@/features/content/components/PageHeader";
import { FacilityGallery } from "@/features/content/components/FacilityGallery";
import { Footer } from "@/features/content/components/Footer";

export default function FacilitiesPage() {
  return (
    <main>
      <PageHeader
        title="Our Facilities"
        subtitle="Everything you need to train hard, recover well, and keep coming back."
        image="/facilities/equipment2.jpg"
      />
      <FacilityGallery />
      <Footer />
    </main>
  );
}
