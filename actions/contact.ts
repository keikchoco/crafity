"use server"

import { messageService } from "@/services/message.service"
import { ValidationError, formatZodError } from "@/lib/errors"
import { isRateLimited } from "@/lib/rate-limit"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { sendEmail, ADMIN_NOTIFICATION_EMAIL, NOTIFICATION_CC_EMAIL } from "@/lib/mailer"
import { ContactNotificationEmail } from "@/emails/contact-notification-email"
import { ContactConfirmationEmail } from "@/emails/contact-confirmation-email"
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
      throw new ValidationError(formatZodError(parsed.error))
    }

    if (isRateLimited(parsed.data.email.toLowerCase())) {
      throw new ValidationError("Too many submissions. Please try again later.")
    }

    await messageService.create(parsed.data)

    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New contact message: ${parsed.data.subject}`,
      react: ContactNotificationEmail(parsed.data),
    })

    await sendEmail({
      to: parsed.data.email,
      cc: NOTIFICATION_CC_EMAIL,
      subject: "We've received your message",
      react: ContactConfirmationEmail(parsed.data),
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
