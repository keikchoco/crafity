import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import type { Project } from "@/types/project"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"
import { ProjectCard } from "@/components/public/project-card"

interface FeaturedWorkProps {
  projects: Pick<
    Project,
    "slug" | "title" | "shortDescription" | "coverImage" | "category" | "technologies" | "websiteLink"
  >[]
  index?: string
}

function FeaturedWork({ projects, index }: FeaturedWorkProps) {
  return (
    <Section>
      <Container size="lg">
        <Stack direction="row" justify="between" align="end" className="mb-10 flex-wrap gap-4">
          <FadeIn>
            <Stack gap="sm">
              <SectionLabel index={index}>Featured Work</SectionLabel>
              <Typography variant="h2">Selected projects</Typography>
            </Stack>
          </FadeIn>
          <FadeIn>
            <Button variant="ghost" render={<Link href="/portfolio" />}>
              View all work
              <ArrowRightIcon />
            </Button>
          </FadeIn>
        </Stack>

        {projects.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Published case studies will appear here once they're marked as featured."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <SlideUp key={project.slug} delay={i * 0.08}>
                <ProjectCard project={project} />
              </SlideUp>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

export { FeaturedWork }
