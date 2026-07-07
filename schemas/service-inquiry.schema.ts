import { z } from "zod"

import { emailSchema } from "@/schemas/common.schema"

export const serviceInquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: emailSchema,
  company: z.string().max(120).optional(),
  projectType: z.string().min(1, "Project type is required").max(120),
  services: z.array(z.string()).min(1, "Select at least one service"),
  budget: z.string().min(1, "Budget range is required").max(120),
  timeline: z.string().min(1, "Timeline is required").max(120),
  description: z.string().min(1, "Project description is required").max(5000),
})

export type InferredServiceInquiryInput = z.infer<typeof serviceInquirySchema>
