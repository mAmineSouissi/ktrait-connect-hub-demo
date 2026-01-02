import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import DetailsAgenceHero from '@/components/landing/DetailsAgenceHero';
import AgencyDetailPage from '@/components/landing/Agencydetailpage';

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