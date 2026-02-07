import type { Metadata } from "next";
import content from "@/content.json";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WorkPageContent } from "@/components/work-page-content";

export const metadata: Metadata = {
  title: "Our Work -- NovaByte",
  description:
    "Explore our portfolio of projects across SaaS, healthcare, e-commerce, fintech, and more. Engineering excellence meets exceptional design.",
};

export default function WorkPage() {
  return (
    <>
      <Header
        companyName={content.company.name}
        navigation={content.navigation}
      />
      <main>
        <WorkPageContent projects={content.work.projects} />
      </main>
      <Footer
        companyName={content.company.name}
        copyright={content.footer.copyright}
        links={content.footer.links}
      />
    </>
  );
}
