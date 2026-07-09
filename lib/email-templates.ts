import { SITE_NAME } from "@/lib/site"

interface EmailContent {
  subject: string
  html: string
}

function baseTemplate(title: string, rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 0;font-size:13px;color:#71717a;width:140px;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:8px 0;font-size:14px;color:#18181b;white-space:pre-wrap;">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join("")

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f4f4f5;padding:32px 16px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
        <div style="padding:20px 24px;border-bottom:1px solid #e4e4e7;">
          <span style="font-size:16px;font-weight:600;color:#18181b;">${SITE_NAME}</span>
        </div>
        <div style="padding:24px;">
          <h1 style="font-size:18px;margin:0 0 16px;color:#18181b;">${escapeHtml(title)}</h1>
          <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
        </div>
      </div>
    </div>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function contactNotificationEmail(data: {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}): EmailContent {
  return {
    subject: `New contact message: ${data.subject}`,
    html: baseTemplate("New contact form submission", [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      ...(data.company ? [{ label: "Company", value: data.company }] : []),
      { label: "Subject", value: data.subject },
      { label: "Message", value: data.message },
    ]),
  }
}

export function serviceInquiryNotificationEmail(data: {
  name: string
  email: string
  company?: string
  service: string
  budget: string
  timeline: string
  description: string
}): EmailContent {
  return {
    subject: `New service inquiry from ${data.name}`,
    html: baseTemplate("New service inquiry", [
      { label: "Name", value: data.name },
      { label: "Email", value: data.email },
      ...(data.company ? [{ label: "Company", value: data.company }] : []),
      { label: "Service", value: data.service },
      { label: "Budget", value: data.budget },
      { label: "Timeline", value: data.timeline },
      { label: "Description", value: data.description },
    ]),
  }
}
