import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import RealisationsHero from "@/components/landing/RealisationHero";
import Realisations from "@/components/landing/Realisations";
import Header from "@/components/landing/layout/Header";

export default function RealisationsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <RealisationsHero />
      <Realisations />
      <Newsletter />
      <Footer />
    </main>
  );
}
