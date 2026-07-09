"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { MenuIcon, MoonIcon, SunIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Container } from "@/components/shared/container"

export interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  logo?: React.ReactNode
  links?: NavLink[]
  actions?: React.ReactNode
  className?: string
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </Button>
  )
}

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-sm bg-foreground text-sm font-bold text-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        C
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">CreaThink</span>
    </Link>
  )
}

function NavItem({ link }: { link: NavLink }) {
  return (
    <Link
      href={link.href}
      className="group relative py-1 font-mono text-xs tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
    >
      {link.label}
      <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
    </Link>
  )
}

function Navbar({ logo, links = [], actions, className }: NavbarProps) {
  return (
    <header
      data-slot="navbar"
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      <Container size="lg">
        <div className="flex h-16 items-center justify-between">
          {logo ?? <Wordmark />}

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavItem key={link.href} link={link} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {actions ?? (
              <Button size="sm" render={<Link href="/contact/service-inquiry" />}>
                Start a Project
                <ArrowRightIcon />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {links.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className="rounded-md px-2 py-2 font-mono text-sm tracking-wide text-foreground uppercase hover:bg-muted"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto px-4 pb-4">
                  {actions ?? (
                    <Button className="w-full" render={<Link href="/contact/service-inquiry" />}>
                      Start a Project
                      <ArrowRightIcon />
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}

export { Navbar }
