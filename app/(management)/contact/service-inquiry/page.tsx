import type { Metadata } from "next"

import { serviceService } from "@/services/service.service"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { ServiceInquiryForm } from "@/components/public/service-inquiry-form"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

export const metadata: Metadata = {
  title: "Start a Project",
  description: "Tell us about your project so we can scope it and get back to you with next steps.",
  alternates: { canonical: "/contact/service-inquiry" },
}

export default async function ServiceInquiryPage() {
  const { items } = await serviceService.list({ status: "published" }, { limit: 50, sort: "order" })

  return (
    <Section>
      <Container size="default">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-2xl">
            <SectionLabel index="01">Start a Project</SectionLabel>
            <Typography variant="h1">Tell us about what you&apos;re building</Typography>
            <Typography variant="body-lg">
              The more detail you share, the faster we can scope your project and come back with
              a plan.
            </Typography>
          </Stack>
        </FadeIn>

        <SlideUp>
          <ServiceInquiryForm availableServices={items.map((service) => service.title)} />
        </SlideUp>
      </Container>
    </Section>
  )
}
