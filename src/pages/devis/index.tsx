import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import GoogleMapCard from '@/components/landing/GoogleMapCard';
import DevisHero from '@/components/landing/DevisHero';
import ConsultationFormServices from '@/components/landing/Consultationformservices';

export default function Devis() {
  return (
    <main className="min-h-screen">
      <Header />
      <DevisHero />
      <ConsultationFormServices />
      <GoogleMapCard />
      <Newsletter />
      <Footer />
    </main>
  );
}