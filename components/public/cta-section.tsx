import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"

interface CtaSectionProps {
  title?: string
  description?: string
  primaryHref?: string
  primaryLabel?: string
}

function CtaSection({
  title = "Have a project in mind?",
  description = "Tell us about it — we'll get back to you within one business day.",
  primaryHref = "/contact/service-inquiry",
  primaryLabel = "Start a Project",
}: CtaSectionProps) {
  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <div className="flex flex-col gap-8 border-t border-b border-border py-14 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <div className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
              <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
              <Button size="lg" render={<Link href={primaryHref} />}>
                {primaryLabel}
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  )
}

export { CtaSection }
