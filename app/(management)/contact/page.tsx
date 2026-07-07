import Link from "next/link"
import type { Metadata } from "next"
import { MailIcon, ClockIcon, ArrowRightIcon } from "lucide-react"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { ContactForm } from "@/components/public/contact-form"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Crafity to talk about your next website or digital product.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <Section>
      <Container size="lg">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <FadeIn>
            <Stack gap="lg">
              <Stack gap="sm">
                <SectionLabel index="01">Contact</SectionLabel>
                <Typography variant="h1">Let&apos;s talk about your project</Typography>
                <Typography variant="body-lg">
                  Tell us a bit about what you&apos;re building and we&apos;ll get back to you
                  within one business day.
                </Typography>
              </Stack>

              <Stack gap="default">
                <Stack direction="row" gap="sm" align="center">
                  <MailIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">hello@crafity.com</span>
                </Stack>
                <Stack direction="row" gap="sm" align="center">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Reply within 1 business day</span>
                </Stack>
              </Stack>

              <div className="rounded-xl border border-border bg-card p-4">
                <p className="mb-2 text-sm text-foreground">
                  Already have a scoped project in mind?
                </p>
                <Button variant="outline" size="sm" render={<Link href="/contact/service-inquiry" />}>
                  Start a Project
                  <ArrowRightIcon />
                </Button>
              </div>
            </Stack>
          </FadeIn>

          <SlideUp>
            <ContactForm />
          </SlideUp>
        </div>
      </Container>
    </Section>
  )
}
