import { z } from "zod"

import { emailSchema } from "@/schemas/common.schema"

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: emailSchema,
  company: z.string().max(120).optional(),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
})

export type InferredContactInput = z.infer<typeof contactSchema>
