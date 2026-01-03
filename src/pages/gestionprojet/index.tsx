import Newsletter from "@/components/landing/layout/Newsletter";
import Footer from "@/components/landing/layout/Footer";
import Header from "@/components/landing/layout/Header";
import ProjectManagementHero from "@/components/landing/ProjectManagementHero";
import ProjectManagementSection from "@/components/landing/ProjectManagementSection";

export default function ProjectManagement() {
  return (
    <main className="min-h-screen">
      <Header />
      <ProjectManagementHero />
      <ProjectManagementSection />
      <Newsletter />
      <Footer />
    </main>
  );
}
