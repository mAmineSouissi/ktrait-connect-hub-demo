import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import PartenairesHero from '@/components/landing/PartenairesHero';
import PortfolioGrid from '@/components/landing/Portfoliogrid';

export default function PartenairesPage() {
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