import Header from "@/components/landing/layout/Header";
import AboutHero from "@/components/landing/AboutHero";
import Process from "@/components/landing/Process";
import Projects from "@/components/landing/Projects";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Discovery from "@/components/landing/Discovery";
import HistoryTimeline from "@/components/landing/Timeline";
import CTA from "@/components/landing/CallToAction";
import Team from "@/components/landing/Team";
import ContactSection from "@/components/landing/Contactsection";
import ClientVIP from "@/components/landing/ClientVIP";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <AboutHero />
      <Discovery />
      <CTA />
      <HistoryTimeline />
      <Process />
      <Team />
      <ContactSection />
      <Projects />
      <Testimonials />
      <ClientVIP />
      <Newsletter />
      <Footer />
    </main>
  );
}
