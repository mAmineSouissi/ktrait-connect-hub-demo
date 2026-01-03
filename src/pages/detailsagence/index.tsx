import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Header from "@/components/landing/layout/Header";
import DetailsAgenceHero from "@/components/landing/DetailsAgenceHero";
import AgencyDetailPage from "@/components/landing/Agencydetailpage";

export default function AgenceManagement() {
  return (
    <main className="min-h-screen">
      <Header />
      <DetailsAgenceHero />
      <AgencyDetailPage />
      <Newsletter />
      <Footer />
    </main>
  );
}
