import * as React from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Container } from "@/components/shared/container"

export interface FooterColumn {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}

interface FooterProps {
  logo?: React.ReactNode
  description?: string
  columns?: FooterColumn[]
  bottomText?: string
  className?: string
}

function Footer({ logo, description, columns = [], bottomText, className }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer data-slot="footer" className={cn("border-t border-border", className)}>
      <Container size="lg" className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-[1.4fr_repeat(auto-fit,minmax(120px,1fr))] sm:gap-x-10 lg:gap-x-12">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
            <span className="font-heading text-3xl font-semibold tracking-tight">
              {logo ?? "Crafity"}
            </span>
            {description && (
              <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {column.title}
              </span>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-1 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRightIcon className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 font-mono text-xs tracking-wide text-muted-foreground uppercase sm:flex-row sm:items-center sm:justify-between">
          <span>{bottomText ?? `© ${year} Crafity. All rights reserved.`}</span>
          <span>Designed & built in-house</span>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
