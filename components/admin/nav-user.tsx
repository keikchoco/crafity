"use client"

import { UserButton } from "@clerk/nextjs"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAdmin } from "@/components/admin/admin-provider"

function NavUser() {
  const admin = useAdmin()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-col gap-2 px-2 py-1.5">
        <UserButton showName appearance={{ elements: { userButtonBox: "flex-row-reverse" } }} />
        {admin.isSuperAdmin && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Super Admin
          </span>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export { NavUser }
