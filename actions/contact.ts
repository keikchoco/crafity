"use server"

import { messageService } from "@/services/message.service"
import { ValidationError } from "@/lib/errors"
import { isRateLimited } from "@/lib/rate-limit"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from "@/lib/mailer"
import { contactNotificationEmail } from "@/lib/email-templates"
import { successResponse, errorResponse } from "@/lib/api-response"
import { contactSchema } from "@/schemas/contact.schema"
import type { ApiResponse } from "@/types/api"

interface ContactFormInput {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  website?: string
}

export async function submitContactAction(input: ContactFormInput): Promise<ApiResponse<null>> {
  try {
    if (input.website) {
      return successResponse(null)
    }

    if (!(await isFeatureEnabled("contact.enabled"))) {
      throw new ValidationError("The contact form is currently unavailable.")
    }

    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input")
    }

    if (isRateLimited(parsed.data.email.toLowerCase())) {
      throw new ValidationError("Too many submissions. Please try again later.")
    }

    await messageService.create(parsed.data)

    const { subject, html } = contactNotificationEmail(parsed.data)
    await sendEmail({ to: ADMIN_NOTIFICATION_EMAIL, subject, html })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
