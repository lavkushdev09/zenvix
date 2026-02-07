import { notFound } from "next/navigation";
import type { Metadata } from "next";
import content from "@/content.json";
import { ProjectPageClient } from "@/components/project-page-client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return content.work.projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = content.work.projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — NovaByte`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} — NovaByte`,
      description: project.shortDescription,
      type: "article",
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = content.work.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header
        companyName={content.company.name}
        navigation={content.navigation}
      />
      <main>
        <ProjectPageClient project={project} contactCta={content.contact.cta} />
      </main>
      <Footer
        companyName={content.company.name}
        copyright={content.footer.copyright}
        links={content.footer.links}
      />
    </>
  );
}
