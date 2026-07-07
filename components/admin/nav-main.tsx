"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useHasPermission } from "@/components/admin/admin-provider"
import type { AdminNavItem } from "@/components/admin/nav-items"

function NavMainItem({ item }: { item: AdminNavItem }) {
  const pathname = usePathname()
  const canView = useHasPermission(item.resource, "view")

  if (!canView) {
    return null
  }

  const isActive = item.url === "/admin" ? pathname === item.url : pathname.startsWith(item.url)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.title} isActive={isActive} render={<Link href={item.url} />}>
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function NavMain({ items }: { items: AdminNavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>CMS</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMainItem key={item.url} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export { NavMain }
