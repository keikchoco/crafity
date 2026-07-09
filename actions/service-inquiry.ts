"use server"

import { serviceInquiryService } from "@/services/service-inquiry.service"
import { ValidationError, formatZodError } from "@/lib/errors"
import { isRateLimited } from "@/lib/rate-limit"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from "@/lib/mailer"
import { serviceInquiryNotificationEmail } from "@/lib/email-templates"
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

    const { subject, html } = serviceInquiryNotificationEmail(parsed.data)
    await sendEmail({ to: ADMIN_NOTIFICATION_EMAIL, subject, html })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
