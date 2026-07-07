import type { Metadata } from "next"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { FadeIn } from "@/components/motion/fade-in"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of the Crafity website and inquiries submitted through it.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = "January 1, 2026"

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using the Crafity website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use this website.",
    ],
  },
  {
    title: "2. Use of the Website",
    body: [
      "This website is provided for informational purposes to showcase Crafity's services, portfolio, and capabilities.",
      "You agree not to misuse the website, including attempting unauthorized access, disrupting site functionality, or submitting fraudulent or malicious information through our forms.",
    ],
  },
  {
    title: "3. Intellectual Property",
    body: [
      "All content on this website, including text, graphics, logos, case studies, and design elements, is the property of Crafity unless otherwise noted, and is protected by applicable intellectual property laws.",
      "Content from published case studies may reference client work; such work remains the property of the respective clients and is featured with permission.",
      "You may not reproduce, distribute, or create derivative works from our content without prior written consent.",
    ],
  },
  {
    title: "4. Inquiries & Proposals",
    body: [
      "Submitting a contact or service inquiry form does not create a binding contract between you and Crafity.",
      "Any project engagement, scope, pricing, and timeline will be governed by a separate, signed agreement between Crafity and the client.",
      "We reserve the right to decline any project inquiry at our discretion.",
    ],
  },
  {
    title: "5. No Warranty",
    body: [
      "This website and its content are provided \"as is\" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose.",
      "We do not guarantee uninterrupted or error-free access to the website.",
    ],
  },
  {
    title: "6. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Crafity shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.",
    ],
  },
  {
    title: "7. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of those external sites.",
    ],
  },
  {
    title: "8. Changes to These Terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "9. Contact Us",
    body: [
      "For questions about these Terms & Conditions, contact us at hello@crafity.com.",
    ],
  },
]

export default function TermsPage() {
  return (
    <Section>
      <Container size="sm">
        <FadeIn>
          <Stack gap="sm" className="mb-12">
            <SectionLabel index="02">Legal</SectionLabel>
            <Typography variant="h1">Terms &amp; Conditions</Typography>
            <Typography variant="small">Last updated: {LAST_UPDATED}</Typography>
          </Stack>
        </FadeIn>

        <Stack gap="xl">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3 border-t border-border pt-6">
              <h2 className="font-heading text-lg font-medium text-foreground">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}
