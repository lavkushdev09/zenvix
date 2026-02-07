import content from "@/content.json";
import { HeroSection } from "@/components/hero-section";
import { TechMarquee } from "@/components/tech-marquee";
import { WorkSection } from "@/components/work-section";
import { ServicesSection } from "@/components/services-section";
import { ContactSection } from "@/components/contact-section";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <>
      <Header
        companyName={content.company.name}
        navigation={content.navigation}
      />
      <main>
        <HeroSection hero={content.hero} />
        <TechMarquee technologies={content.technologies} />
        <WorkSection
          sectionTitle={content.work.sectionTitle}
          sectionDescription={content.work.sectionDescription}
          projects={content.work.projects}
        />
        <ServicesSection services={content.services} />
        <ContactSection contact={content.contact} />
      </main>
      <Footer
        companyName={content.company.name}
        copyright={content.footer.copyright}
        links={content.footer.links}
      />
    </>
  );
}
