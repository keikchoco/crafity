import { Heading, Text } from "@react-email/components"

import { SITE_NAME } from "@/lib/site"
import { EmailLayout } from "@/emails/components/email-layout"
import { SummaryCard } from "@/emails/components/summary-card"

interface ContactConfirmationEmailProps {
  name: string
  subject: string
  message: string
}

function ContactConfirmationEmail({ name, subject, message }: ContactConfirmationEmailProps) {
  const firstName = name.trim().split(/\s+/)[0] || name

  return (
    <EmailLayout previewText={`We've received your message — ${SITE_NAME}`}>
      <Heading className="m-0 mb-3 text-[20px] text-[#18181b]">Thanks for reaching out, {firstName}</Heading>
      <Text className="m-0 mb-6 text-[14px] leading-6 text-[#3f3f46]">
        We&apos;ve received your message and a member of our team will get back to you within 1–2
        business days. In the meantime, here&apos;s a copy of what you sent us.
      </Text>
      <SummaryCard
        title="Your message"
        rows={[
          { label: "Subject", value: subject },
          { label: "Message", value: message },
        ]}
      />
      <Text className="m-0 text-[14px] leading-6 text-[#3f3f46]">Talk soon,</Text>
      <Text className="m-0 text-[14px] font-semibold leading-6 text-[#18181b]">The {SITE_NAME} team</Text>
    </EmailLayout>
  )
}

export { ContactConfirmationEmail }
export default ContactConfirmationEmail
