import Link from "next/link"
import type { Metadata } from "next"

import { projectService } from "@/services/project.service"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { EmptyState } from "@/components/shared/empty-state"
import { ProjectCard } from "@/components/public/project-card"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Case studies and projects built by Crafity — web development, UI/UX design, and full stack platforms.",
  alternates: { canonical: "/portfolio" },
}

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { category } = await searchParams
  const { items } = await projectService.list({ status: "published" }, { limit: 100, sort: "-createdAt" })

  const categories = Array.from(new Set(items.map((project) => project.category))).sort()
  const activeCategory = category && categories.includes(category) ? category : undefined
  const filteredProjects = activeCategory
    ? items.filter((project) => project.category === activeCategory)
    : items

  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-2xl">
            <SectionLabel index="01">Portfolio</SectionLabel>
            <Typography variant="h1">Selected work</Typography>
            <Typography variant="body-lg">
              A collection of projects across web development, UI/UX design, and full stack
              platforms.
            </Typography>
          </Stack>
        </FadeIn>

        {categories.length > 0 && (
          <FadeIn className="mb-10 flex flex-wrap gap-2">
            <Link
              href="/portfolio"
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-sm transition-colors",
                !activeCategory
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/portfolio?category=${encodeURIComponent(cat)}`}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors",
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {cat}
              </Link>
            ))}
          </FadeIn>
        )}

        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="No published projects match this filter yet."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <SlideUp key={project.slug} delay={(index % 6) * 0.06}>
                <ProjectCard
                  project={{
                    slug: project.slug,
                    title: project.title,
                    shortDescription: project.shortDescription,
                    coverImage: project.coverImage,
                    category: project.category,
                    technologies: project.technologies,
                  }}
                />
              </SlideUp>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
