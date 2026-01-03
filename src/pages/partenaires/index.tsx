import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Header from "@/components/landing/layout/Header";
import PartenairesHero from "@/components/landing/PartenairesHero";
import PortfolioGrid from "@/components/landing/Portfoliogrid";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <PartenairesHero />
      <PortfolioGrid />
      <Newsletter />
      <Footer />
    </main>
  );
}
