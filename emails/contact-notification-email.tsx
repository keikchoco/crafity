import { Heading, Text } from "@react-email/components"

import { EmailLayout } from "@/emails/components/email-layout"
import { SummaryCard } from "@/emails/components/summary-card"

interface ContactNotificationEmailProps {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}

function ContactNotificationEmail({
  name,
  email,
  company,
  subject,
  message,
}: ContactNotificationEmailProps) {
  return (
    <EmailLayout previewText={`New contact message: ${subject}`}>
      <Heading className="m-0 mb-4 text-[18px] text-[#18181b]">New contact form submission</Heading>
      <SummaryCard
        title="Submission details"
        rows={[
          { label: "Name", value: name },
          { label: "Email", value: email },
          ...(company ? [{ label: "Company", value: company }] : []),
          { label: "Subject", value: subject },
          { label: "Message", value: message },
        ]}
      />
      <Text className="m-0 text-[13px] text-[#71717a]">Reply directly to the sender&apos;s email above.</Text>
    </EmailLayout>
  )
}

export { ContactNotificationEmail }
export default ContactNotificationEmail
