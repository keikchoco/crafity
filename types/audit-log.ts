export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "RESTORE"
  | "PUBLISH"
  | "ARCHIVE"
  | "LOGIN"
  | "PERMISSION_CHANGE"

export interface AuditLog {
  _id: string
  userId: string
  action: AuditAction
  resource: string
  resourceId: string
  oldValue: unknown
  newValue: unknown
  ipAddress: string | null
  createdAt: Date
}
