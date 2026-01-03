import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Header from "@/components/landing/layout/Header";
import ServicesHero from "@/components/landing/ServicesHero";
import ServicesPage from "@/components/landing/ServicesPage";

export default function Services() {
  return (
    <main className="min-h-screen">
      <Header />
      <ServicesHero />
      <ServicesPage />
      <Newsletter />
      <Footer />
    </main>
  );
}
