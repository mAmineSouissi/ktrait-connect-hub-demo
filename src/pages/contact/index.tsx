import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Header from "@/components/landing/layout/Header";
import ContactHero from "@/components/landing/ContactHero";
import ContactSection from "@/components/landing/Contactsection";
import GoogleMapCard from "@/components/landing/GoogleMapCard";

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
