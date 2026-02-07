import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactPageContent } from "@/components/contact-page-content";
import content from "@/content.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - NovaByte",
  description:
    "Get in touch with NovaByte. Let us discuss your project and how we can help you build something great.",
};

export default function ContactPage() {
  return (
    <>
      <Header
        companyName={content.company.name}
        navigation={content.navigation}
      />
      <main>
        <ContactPageContent contact={content.contact} />
      </main>
      <Footer
        companyName={content.company.name}
        copyright={content.footer.copyright}
        links={content.footer.links}
      />
    </>
  );
}
