import type { Metadata } from "next"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { FadeIn } from "@/components/motion/fade-in"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms governing your use of the ${SITE_NAME} website and inquiries submitted through it.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = "January 1, 2026"

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      `By accessing or using the ${SITE_NAME} website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use this website.`,
    ],
  },
  {
    title: "2. Use of the Website",
    body: [
      `This website is provided for informational purposes to showcase ${SITE_NAME}'s services, portfolio, and capabilities.`,
      "You agree not to misuse the website, including attempting unauthorized access, disrupting site functionality, or submitting fraudulent or malicious information through our forms.",
    ],
  },
  {
    title: "3. Intellectual Property",
    body: [
      `All content on this website, including text, graphics, logos, case studies, and design elements, is the property of ${SITE_NAME} unless otherwise noted, and is protected by applicable intellectual property laws.`,
      "Content from published case studies may reference client work; such work remains the property of the respective clients and is featured with permission.",
      "You may not reproduce, distribute, or create derivative works from our content without prior written consent.",
    ],
  },
  {
    title: "4. Inquiries & Proposals",
    body: [
      `Submitting a contact or service inquiry form does not create a binding contract between you and ${SITE_NAME}.`,
      `Any project engagement, scope, pricing, and timeline will be governed by a separate, signed agreement between ${SITE_NAME} and the client.`,
      "We reserve the right to decline any project inquiry at our discretion.",
    ],
  },
  {
    title: "5. Services",
    body: [
      `${SITE_NAME} provides UI/UX design, frontend development, backend development, and full stack application development services as described on this website and in individual project proposals.`,
      "The specific scope, deliverables, milestones, and timeline for a project will be defined in a separate written proposal or agreement accepted by both parties before work begins.",
      "We reserve the right to decline, pause, or terminate a project if the client fails to provide necessary access, content, feedback, or approvals within a reasonable time, or breaches the agreed terms.",
      "Any work outside the agreed scope (\"out-of-scope work\") may require a separate quote, timeline adjustment, or additional fee before it is undertaken.",
    ],
  },
  {
    title: "6. Payment",
    body: [
      "Unless otherwise agreed in writing, projects require a 50% deposit before work begins. The remaining balance must be paid in full before the completed project is handed over.",
      "For larger projects that are sectionized or modularized into distinct phases or deliverables, payments may instead be scheduled separately per section or module, as outlined in the applicable proposal or agreement.",
      "We accept payment via PayPal, GCash, Maya, or bank transfer. Payment details will be provided in the applicable proposal or invoice.",
      "Invoices are due upon receipt unless a different payment term is specified. Late payments may result in a pause of ongoing work until the outstanding balance is settled.",
      "The initial 50% deposit is non-refundable once work has commenced, except as otherwise agreed in writing or required by applicable law.",
      "The client is responsible for any taxes, duties, or transaction fees associated with payment, unless otherwise stated in the agreement.",
    ],
  },
  {
    title: "7. No Warranty",
    body: [
      "This website and its content are provided \"as is\" without warranties of any kind, express or implied, including accuracy, completeness, or fitness for a particular purpose.",
      "We do not guarantee uninterrupted or error-free access to the website.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      `To the fullest extent permitted by law, ${SITE_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website.`,
    ],
  },
  {
    title: "9. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of those external sites.",
    ],
  },
  {
    title: "10. Changes to These Terms",
    body: [
      "We may revise these Terms & Conditions at any time. Continued use of the website after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "11. Contact Us",
    body: [
      `For questions about these Terms & Conditions, contact us at ${CONTACT_EMAIL}.`,
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
