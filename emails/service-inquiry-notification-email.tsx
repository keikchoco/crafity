import { Heading, Text } from "@react-email/components"

import { EmailLayout } from "@/emails/components/email-layout"
import { SummaryCard } from "@/emails/components/summary-card"

interface ServiceInquiryNotificationEmailProps {
  name: string
  email: string
  company?: string
  service: string
  budget: string
  timeline: string
  description: string
}

function ServiceInquiryNotificationEmail({
  name,
  email,
  company,
  service,
  budget,
  timeline,
  description,
}: ServiceInquiryNotificationEmailProps) {
  return (
    <EmailLayout previewText={`New service inquiry from ${name}`}>
      <Heading className="m-0 mb-4 text-[18px] text-[#18181b]">New service inquiry</Heading>
      <SummaryCard
        title="Inquiry details"
        rows={[
          { label: "Name", value: name },
          { label: "Email", value: email },
          ...(company ? [{ label: "Company", value: company }] : []),
          { label: "Service", value: service },
          { label: "Budget", value: budget },
          { label: "Timeline", value: timeline },
          { label: "Description", value: description },
        ]}
      />
      <Text className="m-0 text-[13px] text-[#71717a]">Reply directly to the sender&apos;s email above.</Text>
    </EmailLayout>
  )
}

export { ServiceInquiryNotificationEmail }
export default ServiceInquiryNotificationEmail
