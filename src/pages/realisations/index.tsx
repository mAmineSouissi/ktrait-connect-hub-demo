import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import RealisationsHero from '@/components/landing/RealisationHero';
import Realisations from '@/components/landing/Realisations';
import Header from '@/components/landing/Header';

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