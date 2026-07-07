import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

const steps = [
  { title: "Discovery", description: "Understanding your goals, audience, and constraints." },
  { title: "Research", description: "Exploring the market, users, and technical landscape." },
  { title: "Planning", description: "Defining scope, architecture, and milestones." },
  { title: "Design", description: "Crafting interfaces that are clear, usable, and on-brand." },
  { title: "Development", description: "Building with clean, scalable, well-tested code." },
  { title: "Testing", description: "Verifying quality across devices and edge cases." },
  { title: "Launch", description: "Shipping to production with confidence." },
  { title: "Iteration", description: "Refining based on real usage and feedback." },
]

interface ProcessSectionProps {
  index?: string
}

function ProcessSection({ index }: ProcessSectionProps) {
  return (
    <Section background="muted">
      <Container size="lg">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-xl">
            <SectionLabel index={index}>How We Work</SectionLabel>
            <Typography variant="h2">A process built on craftsmanship</Typography>
          </Stack>
        </FadeIn>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, stepIndex) => (
            <SlideUp key={step.title} delay={stepIndex * 0.05}>
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <span className="font-mono text-xs text-primary">
                  {String(stepIndex + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </SlideUp>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { ProcessSection }
