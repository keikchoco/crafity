import type { Metadata } from "next"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { ProcessSection } from "@/components/public/process-section"
import { CtaSection } from "@/components/public/cta-section"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

export const metadata: Metadata = {
  title: "About",
  description: "CreaThink is a two-person creative development studio building premium websites and digital products.",
  alternates: { canonical: "/about" },
}

const values = [
  {
    title: "Craftsmanship",
    description: "Every detail — from spacing to server response times — is considered deliberately.",
  },
  {
    title: "Transparency",
    description: "Clear communication and honest timelines, from kickoff to launch.",
  },
  {
    title: "Ownership",
    description: "We treat every project like our own product, not just a deliverable.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container size="lg">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <FadeIn>
              <Stack gap="sm">
                <SectionLabel index="01">About CreaThink</SectionLabel>
                <Typography variant="h1">
                  Two founders. One shared obsession with building things well.
                </Typography>
              </Stack>
            </FadeIn>
            <SlideUp>
              <Typography variant="body-lg">
                CreaThink was started by two developer-designers who were tired of choosing between
                beautiful interfaces and solid engineering. We believe the best digital products
                come from teams that care about both — so that&apos;s how we work, on every
                project we take on.
              </Typography>
            </SlideUp>
          </div>
        </Container>
      </Section>

      <Section background="muted">
        <Container size="lg">
          <FadeIn>
            <Stack gap="sm" className="mb-10 max-w-xl">
              <SectionLabel index="02">What We Value</SectionLabel>
              <Typography variant="h2">The principles behind our work</Typography>
            </Stack>
          </FadeIn>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
            {values.map((value, index) => (
              <SlideUp key={value.title} delay={index * 0.08}>
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </SlideUp>
            ))}
          </div>
        </Container>
      </Section>

      <ProcessSection index="03" />

      <CtaSection
        title="Let's build something together"
        description="Whether you have a fully-scoped project or just an idea, we'd love to hear about it."
      />
    </>
  )
}
