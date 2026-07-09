import "server-only"
import type { ReactElement } from "react"
import { Resend } from "resend"

import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site"

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || `${SITE_NAME} <onboarding@resend.dev>`
export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || CONTACT_EMAIL
export const NOTIFICATION_CC_EMAIL = "jeremiahnueno2017@gmail.com"

let resendClient: Resend | null = null

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

interface SendEmailInput {
  to: string
  cc?: string | string[]
  subject: string
  react: ReactElement
}

export async function sendEmail({ to, cc, subject, react }: SendEmailInput): Promise<void> {
  const client = getClient()

  if (!client) {
    console.warn(`[mailer] RESEND_API_KEY not configured — skipping email "${subject}" to ${to}`)
    return
  }

  try {
    await client.emails.send({ from: FROM_EMAIL, to, cc, subject, react })
  } catch (error) {
    console.error("[mailer] Failed to send email:", error)
  }
}
