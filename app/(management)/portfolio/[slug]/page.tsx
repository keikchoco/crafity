import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowUpRightIcon } from "lucide-react"

import { projectService } from "@/services/project.service"
import { SITE_URL } from "@/lib/site"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { CtaSection } from "@/components/public/cta-section"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const { items } = await projectService.list({ status: "published" }, { limit: 200 })
    return items.map((project) => ({ slug: project.slug }))
  } catch {
    return []
  }
}

async function getProject(slug: string) {
  const project = await projectService.getPublishedBySlug(slug)
  if (!project) notFound()
  return project
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await projectService.getPublishedBySlug(slug)
  if (!project) return { title: "Project not found" }

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.shortDescription,
    keywords: project.seo?.keywords,
    alternates: { canonical: project.seo?.canonicalUrl || `/portfolio/${project.slug}` },
    openGraph: {
      title: project.seo?.title || project.title,
      description: project.seo?.description || project.shortDescription,
      images: project.seo?.ogImage ? [project.seo.ogImage] : [project.coverImage],
      type: "article",
    },
  }
}

const contentSections: { key: "problem" | "research" | "solution" | "designProcess" | "developmentProcess" | "results"; title: string }[] = [
  { key: "problem", title: "The Problem" },
  { key: "research", title: "Research" },
  { key: "solution", title: "The Solution" },
  { key: "designProcess", title: "Design Process" },
  { key: "developmentProcess", title: "Development Process" },
  { key: "results", title: "Results" },
]

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    image: project.coverImage,
    url: `${SITE_URL}/portfolio/${project.slug}`,
    creator: { "@type": "Organization", name: "CreaThink" },
    keywords: project.technologies.join(", "),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="pb-0">
        <Container size="lg">
          <FadeIn>
            <Stack gap="sm" className="mb-8 max-w-3xl">
              <Typography variant="caption">{project.category}</Typography>
              <Typography variant="h1">{project.title}</Typography>
              <Typography variant="body-lg">{project.shortDescription}</Typography>
            </Stack>
          </FadeIn>

          <SlideUp className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
            />
          </SlideUp>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
            <FadeIn>
              <Typography variant="body-lg" className="max-w-2xl text-foreground">
                {project.description}
              </Typography>
            </FadeIn>

            <SlideUp>
              <Stack gap="lg" className="rounded-xl border border-border bg-card p-6">
                <DetailRow label="Client" value={project.client} />
                <DetailRow label="Timeline" value={project.timeline} />
                <DetailRow label="Role" value={project.role} />
                {project.websiteLink && (
                  <Button
                    variant="outline"
                    className="w-full"
                    render={
                      <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    Visit website
                    <ArrowUpRightIcon />
                  </Button>
                )}
                {project.technologies.length > 0 && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Technologies
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Stack>
            </SlideUp>
          </div>
        </Container>
      </Section>

      {contentSections
        .filter((section) => project[section.key])
        .map((section, index) => (
          <Section key={section.key} background={index % 2 === 0 ? "muted" : "none"}>
            <Container size="lg">
              <SlideUp>
                <Stack gap="sm" className="max-w-3xl">
                  <Typography variant="h2">{section.title}</Typography>
                  <Typography variant="body-lg">{project[section.key]}</Typography>
                </Stack>
              </SlideUp>
            </Container>
          </Section>
        ))}

      {project.gallery.length > 0 && (
        <Section>
          <Container size="lg">
            <FadeIn>
              <Typography variant="h2" className="mb-8">
                Gallery
              </Typography>
            </FadeIn>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {project.gallery.map((image, index) => (
                <SlideUp
                  key={image.url}
                  delay={index * 0.06}
                  className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </SlideUp>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaSection
        title="Have a similar project?"
        description="Let's talk about what you're building and how we can help."
      />
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}
