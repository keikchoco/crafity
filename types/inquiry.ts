export type ServiceInquiryStatus = "new" | "reviewed" | "contacted" | "completed" | "archived"

export interface ServiceInquiry {
  _id: string
  name: string
  email: string
  company?: string
  projectType: string
  services: string[]
  budget: string
  timeline: string
  description: string
  status: ServiceInquiryStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}
