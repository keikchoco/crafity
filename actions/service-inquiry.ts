"use server"

import { serviceInquiryService } from "@/services/service-inquiry.service"
import { ValidationError, formatZodError } from "@/lib/errors"
import { isRateLimited } from "@/lib/rate-limit"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { sendEmail, ADMIN_NOTIFICATION_EMAIL, NOTIFICATION_CC_EMAIL } from "@/lib/mailer"
import { ServiceInquiryNotificationEmail } from "@/emails/service-inquiry-notification-email"
import { ServiceInquiryConfirmationEmail } from "@/emails/service-inquiry-confirmation-email"
import { successResponse, errorResponse } from "@/lib/api-response"
import { serviceInquirySchema } from "@/schemas/service-inquiry.schema"
import type { ApiResponse } from "@/types/api"

interface ServiceInquiryFormInput {
  name: string
  email: string
  company?: string
  service: string
  budget: string
  timeline: string
  description: string
  website?: string
}

export async function submitServiceInquiryAction(
  input: ServiceInquiryFormInput,
): Promise<ApiResponse<null>> {
  try {
    if (input.website) {
      return successResponse(null)
    }

    if (!(await isFeatureEnabled("serviceInquiry.enabled"))) {
      throw new ValidationError("The service inquiry form is currently unavailable.")
    }

    const parsed = serviceInquirySchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    if (isRateLimited(parsed.data.email.toLowerCase())) {
      throw new ValidationError("Too many submissions. Please try again later.")
    }

    await serviceInquiryService.create(parsed.data)

    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New service inquiry from ${parsed.data.name}`,
      react: ServiceInquiryNotificationEmail(parsed.data),
    })

    await sendEmail({
      to: parsed.data.email,
      cc: NOTIFICATION_CC_EMAIL,
      subject: "We've received your inquiry",
      react: ServiceInquiryConfirmationEmail(parsed.data),
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
