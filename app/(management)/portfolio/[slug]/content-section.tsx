"use client"
import { SlideUp } from "@/components/motion/slide-up"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Stack } from "@/components/shared/stack"
import { Typography } from "@/components/shared/typography"
import { Button } from "@/components/ui/button"
import { ProjectDocument } from "@/models/Project"
import { useState } from "react"

type ContentSectionKey =
  | "problem"
  | "research"
  | "solution"
  | "designProcess"
  | "developmentProcess"
  | "results"

const contentSections: { key: ContentSectionKey; title: string }[] = [
  { key: "problem", title: "Problem" },
  { key: "research", title: "Research" },
  { key: "solution", title: "Solution" },
  { key: "designProcess", title: "Design" },
  { key: "developmentProcess", title: "Development" },
  { key: "results", title: "Results" },
]

const ContentSection = ({ project }: { project: ProjectDocument }) => {
  const [activeContentSection, setActiveContentSection] =
    useState<ContentSectionKey>("problem")

  return (
    <>
      <Section background={"muted"} className="flex flex-col gap-8 pt-8!">
        <div className="mx-auto flex w-fit flex-row flex-wrap justify-center items-center">
          {contentSections.map((section) => (
            <Button
              key={section.key}
              variant={
                activeContentSection === section.key ? "default" : "outline"
              }
              size="sm"
              className="mr-2 mb-2 rounded-full"
              onClick={() => setActiveContentSection(section.key)}
            >
              {section.title}
            </Button>
          ))}
        </div>

        {contentSections
          .filter((section) => activeContentSection === section.key)
          .map((section, index) => (
            <Section key={section.key} className="py-0!">
              <Container size="lg">
                <SlideUp>
                  <Stack gap="sm" className="max-w-3xl">
                    <Typography variant="h2">{section.title}</Typography>
                    <Typography variant="body-lg">
                      {project[section.key]}
                    </Typography>
                  </Stack>
                </SlideUp>
              </Container>
            </Section>
          ))}
      </Section>
    </>
  )
}

export default ContentSection
