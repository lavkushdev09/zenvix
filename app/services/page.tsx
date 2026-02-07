import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServicesPageContent } from "@/components/services-page-content";
import content from "@/content.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - NovaByte",
  description:
    "Explore our full range of digital services including web development, cloud infrastructure, AI automation, and UI/UX design.",
};

export default function ServicesPage() {
  return (
    <>
      <Header
        companyName={content.company.name}
        navigation={content.navigation}
      />
      <main>
        <ServicesPageContent />
      </main>
      <Footer
        companyName={content.company.name}
        copyright={content.footer.copyright}
        links={content.footer.links}
      />
    </>
  );
}
