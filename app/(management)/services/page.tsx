import type { Metadata } from "next"

import { serviceService } from "@/services/service.service"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { ServicesGrid } from "@/components/public/services-grid"
import { CtaSection } from "@/components/public/cta-section"
import { FadeIn } from "@/components/motion/fade-in"

export const metadata: Metadata = {
  title: "Services",
  description:
    "UI/UX design, frontend development, backend development, and full stack solutions from Crafity.",
  alternates: { canonical: "/services" },
}

export default async function ServicesPage() {
  const { items } = await serviceService.list({ status: "published" }, { limit: 50, sort: "order" })

  return (
    <>
      <Section>
        <Container size="lg">
          <FadeIn>
            <Stack gap="sm" className="mb-12 max-w-2xl">
              <SectionLabel index="01">Services</SectionLabel>
              <Typography variant="h1">What we can build for you</Typography>
              <Typography variant="body-lg">
                From interface design to production infrastructure, we cover the full lifecycle
                of a digital product.
              </Typography>
            </Stack>
          </FadeIn>

          <ServicesGrid
            services={items.map((service) => ({
              _id: String(service._id),
              title: service.title,
              description: service.description,
              icon: service.icon,
              features: service.features,
            }))}
          />
        </Container>
      </Section>

      <CtaSection />
    </>
  )
}
