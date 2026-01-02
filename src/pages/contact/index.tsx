import Newsletter from '@/components/landing/Newsletter';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import ContactHero from '@/components/landing/ContactHero';
import ContactSection from '@/components/landing/Contactsection';
import GoogleMapCard from '@/components/landing/GoogleMapCard';

export default function Contact() {
  return (
    <main className="min-h-screen">
      <Header />
      <ContactHero />
      <ContactSection />
      <GoogleMapCard />
      <Newsletter />
      <Footer />
    </main>
  );
}