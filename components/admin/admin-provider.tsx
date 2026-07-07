"use client"

import * as React from "react"

import type { Action, CurrentAdmin, Resource } from "@/types/permissions"

const AdminContext = React.createContext<CurrentAdmin | null>(null)

interface AdminProviderProps {
  admin: CurrentAdmin
  children: React.ReactNode
}

function AdminProvider({ admin, children }: AdminProviderProps) {
  return <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
}

function useAdmin(): CurrentAdmin {
  const admin = React.useContext(AdminContext)

  if (!admin) {
    throw new Error("useAdmin() must be used within an AdminProvider")
  }

  return admin
}

function useHasPermission(resource: Resource, action: Action): boolean {
  const admin = useAdmin()

  if (admin.isSuperAdmin) {
    return true
  }

  return admin.permissions[resource]?.[action] === true
}

export { AdminProvider, useAdmin, useHasPermission }
