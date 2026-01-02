import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import About from "@/components/landing/About";
import Stats from "@/components/landing/Stats";
import Process from "@/components/landing/Process";
import Projects from "@/components/landing/Projects";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";
import CTA from "@/components/landing/CallToAction";
import ServicesListSection from "@/components/landing/Serviceslistsection";
import ExperienceSection from "@/components/landing/ExperienceSection";
import Team from "@/components/landing/Team";
import Blog from "@/components/landing/Blog";
import GalleryCollage from "@/components/landing/GalleryCollage";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <ServicesListSection />
      <Stats />
      <Process />
      <Projects />
      <ExperienceSection />
      <Team />
      <CTA />
      <Blog />
      <GalleryCollage />
      <Newsletter />
      <Footer />
    </main>
  );
}
