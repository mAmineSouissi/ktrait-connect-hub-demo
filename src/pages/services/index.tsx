import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import ServicesHero from '@/components/landing/ServicesHero';
import ServicesPage from '@/components/landing/ServicesPage';

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