"use client"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/button"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link";

const stepsHome = [
  {
    title: "Discover",
    description: "Understanding your goals, audience, and the market you're in",
  },
  {
    title: "Design",
    description:
      "Wireframes, prototypes, and interfaces that are clear and on-brand",
  },
  {
    title: "Build",
    description:
      "Clean, scalable development from first component to final integration",
  },
  {
    title: "Iteration",
    description: "Refining based on real usage and feedback.",
  },
]

const steps = [
  {
    title: "Discover",
    description: "Understanding your goals, audience, and the market you're in",
  },
  {
    title: "Research",
    description: "Exploring the market, users, and technical landscape.",
  },
  {
    title: "Planning",
    description: "Defining scope, architecture, and milestones.",
  },
  {
    title: "Design",
    description:
      "Wireframes, prototypes, and interfaces that are clear and on-brand",
  },
  {
    title: "Build",
    description:
      "Clean, scalable development from first component to final integration",
  },
  {
    title: "Testing",
    description: "Verifying quality across devices and edge cases.",
  },
  {
    title: "Launch",
    description: "Shipping to production, then refining based on real usage",
  },
  {
    title: "Iteration",
    description: "Refining based on real usage and feedback.",
  },
]

interface ProcessSectionProps {
  index?: string
}

function ProcessSection({ index }: ProcessSectionProps) {
  const pathname = usePathname()
  const stepsToShow = pathname === "/" ? stepsHome : steps

  return (
    <Section background="muted">
      <Container size="lg">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-xl">
            <SectionLabel index={index}>How We Work</SectionLabel>
            <Typography variant="h2">
              Every project follows a clear process from discovery to
              launch.{" "}
            </Typography>
          </Stack>
        </FadeIn>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {stepsToShow.map((step, stepIndex) => {
            return (
              <SlideUp key={step.title} delay={stepIndex * 0.05}>
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <span className="font-mono text-xs text-primary">
                    {String(stepIndex + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-base font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </SlideUp>
            )
          })}
        </div>

        <FadeIn className="ml-auto mt-4 w-fit">
          <Button className="ml-auto" variant="ghost" render={<Link href="/portfolio" />}>
            See how we work
            <ArrowRightIcon />
          </Button>
        </FadeIn>
      </Container>
    </Section>
  )
}

export { ProcessSection }
