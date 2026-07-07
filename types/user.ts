export type AdminRole = "admin" | "super_admin"
export type UserStatus = "active" | "disabled"

export interface User {
  _id: string
  clerkUserId: string
  name: string
  email: string
  role: AdminRole
  lastLogin: Date | null
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}
