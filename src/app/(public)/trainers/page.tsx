import { PageHeader } from "@/features/content/components/PageHeader";
import { TrainerCarousel } from "@/features/content/components/TrainerCarousel";
import { Footer } from "@/features/content/components/Footer";

export default function TrainersPage() {
  return (
    <main>
      <PageHeader
        title="Our Trainers"
        subtitle="Coaches who'll push your training and keep you accountable."
        image="/facilities/IMG_0467.jpg"
      />
      <TrainerCarousel />
      <Footer />
    </main>
  );
}
