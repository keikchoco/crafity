import { Heading, Text } from "@react-email/components"

import { SITE_NAME } from "@/lib/site"
import { EmailLayout } from "@/emails/components/email-layout"
import { SummaryCard } from "@/emails/components/summary-card"

interface ServiceInquiryConfirmationEmailProps {
  name: string
  service: string
  budget: string
  timeline: string
  description: string
}

function ServiceInquiryConfirmationEmail({
  name,
  service,
  budget,
  timeline,
  description,
}: ServiceInquiryConfirmationEmailProps) {
  const firstName = name.trim().split(/\s+/)[0] || name

  return (
    <EmailLayout previewText={`We've received your inquiry — ${SITE_NAME}`}>
      <Heading className="m-0 mb-3 text-[20px] text-[#18181b]">Thanks for your inquiry, {firstName}</Heading>
      <Text className="m-0 mb-6 text-[14px] leading-6 text-[#3f3f46]">
        We&apos;ve received your project details and our team is reviewing them now. We&apos;ll
        follow up shortly to discuss next steps. Here&apos;s a summary of what you submitted.
      </Text>
      <SummaryCard
        title="Your project details"
        rows={[
          { label: "Service", value: service },
          { label: "Budget", value: budget },
          { label: "Timeline", value: timeline },
          { label: "Description", value: description },
        ]}
      />
      <Text className="m-0 text-[14px] leading-6 text-[#3f3f46]">Talk soon,</Text>
      <Text className="m-0 text-[14px] font-semibold leading-6 text-[#18181b]">The {SITE_NAME} team</Text>
    </EmailLayout>
  )
}

export { ServiceInquiryConfirmationEmail }
export default ServiceInquiryConfirmationEmail
