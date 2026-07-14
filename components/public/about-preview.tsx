import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

interface AboutPreviewProps {
  index?: string
}

function AboutPreview({ index }: AboutPreviewProps) {
  return (
    <Section background="muted">
      <Container size="lg">
        <div className="grid grid-cols-1  gap-10 lg:grid-cols-2">
          <FadeIn>
            <Stack gap="sm">
              <SectionLabel index={index}>Why CreaThink</SectionLabel>
              <Typography variant="h2">
                Built to give every project full attention.
              </Typography>
            </Stack>
          </FadeIn>

          <SlideUp>
            <Stack gap="lg">
              <Typography variant="body-lg">
                Every project gets our full, direct attention, not handed off to
                someone junior after the pitch. Design and engineering work
                through every decision together with you, so nothing gets lost
                between the two.
              </Typography>
              <Button
                variant="outline"
                className="self-start"
                render={<Link href="/about" />}
              >
                More about us
                <ArrowRightIcon />
              </Button>
            </Stack>
          </SlideUp>
        </div>
      </Container>
    </Section>
  )
}

export { AboutPreview }
