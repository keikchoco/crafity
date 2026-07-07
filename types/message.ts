export type MessageStatus = "new" | "read" | "archived" | "completed"

export interface Message {
  _id: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  status: MessageStatus
  createdAt: Date
}
