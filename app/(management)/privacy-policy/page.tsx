import type { Metadata } from "next"

import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { FadeIn } from "@/components/motion/fade-in"
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects the information you share with us.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = "January 1, 2026"

const sections = [
  {
    title: "1. Introduction",
    body: [
      `This Privacy Policy explains how ${SITE_NAME} ("we", "us", or "our") collects, uses, and safeguards information when you visit our website or submit an inquiry through our contact and project forms.`,
      "By using our website, you agree to the practices described in this policy. If you do not agree, please discontinue use of the site.",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "Contact details you provide voluntarily, such as your name, email address, company, and any information included in a contact or service inquiry form.",
      "Project details you share with us, including budget range, timeline, and project description, used solely to evaluate and respond to your inquiry.",
      "Usage data collected automatically, such as browser type, device information, pages visited, and referral source, used to understand site performance.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "To respond to contact and service inquiries and communicate about potential projects.",
      "To improve our website's content, performance, and user experience.",
      "To maintain the security and integrity of our systems and prevent abuse of our forms.",
    ],
  },
  {
    title: "4. Data Storage & Security",
    body: [
      "Information submitted through our forms is stored securely in our database and is accessible only to authorized administrators.",
      "We apply reasonable technical and organizational measures to protect your information, including input validation, access controls, and encrypted connections.",
      "No method of transmission or storage is completely secure; while we strive to protect your data, we cannot guarantee absolute security.",
    ],
  },
  {
    title: "5. Cookies & Tracking",
    body: [
      "We may use essential cookies to remember your theme preference and support core site functionality.",
      "We do not use third-party advertising trackers. Any analytics used are limited to understanding aggregate site performance.",
    ],
  },
  {
    title: "6. Sharing of Information",
    body: [
      "We do not sell, rent, or trade your personal information.",
      "We may share information with trusted service providers (such as our email delivery and hosting providers) strictly to operate our website and respond to inquiries, under obligations to keep it confidential.",
      "We may disclose information if required by law or to protect our legal rights.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      `You may request access to, correction of, or deletion of the personal information you have submitted to us by contacting ${CONTACT_EMAIL}.`,
      "You may opt out of future communications from us at any time by replying to any email or contacting us directly.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.",
    ],
  },
  {
    title: "9. Contact Us",
    body: [
      `If you have questions about this Privacy Policy or how your information is handled, contact us at ${CONTACT_EMAIL}.`,
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <Section>
      <Container size="sm">
        <FadeIn>
          <Stack gap="sm" className="mb-12">
            <SectionLabel index="01">Legal</SectionLabel>
            <Typography variant="h1">Privacy Policy</Typography>
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
