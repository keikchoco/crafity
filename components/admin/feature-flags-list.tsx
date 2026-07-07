"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { toggleFeatureFlagAction } from "@/actions/feature-flags"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface FeatureFlagRow {
  key: string
  label: string
  description: string
  enabled: boolean
}

interface FeatureFlagsListProps {
  flags: FeatureFlagRow[]
}

function FeatureFlagsList({ flags }: FeatureFlagsListProps) {
  const router = useRouter()
  const [pending, setPending] = React.useState<string | null>(null)

  async function handleToggle(flag: FeatureFlagRow) {
    setPending(flag.key)
    const response = await toggleFeatureFlagAction(flag.key, !flag.enabled)
    setPending(null)

    if (!response.success) {
      toast.error(response.error.message)
      return
    }

    toast.success(`${flag.label} ${!flag.enabled ? "enabled" : "disabled"}`)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3">
      {flags.map((flag) => (
        <Card key={flag.key}>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{flag.label}</span>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {flag.key}
                </code>
              </div>
              <p className="text-sm text-muted-foreground">{flag.description}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={flag.enabled}
              disabled={pending === flag.key}
              onClick={() => handleToggle(flag)}
              className={cn(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
                flag.enabled ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-background transition-transform",
                  flag.enabled && "translate-x-5",
                )}
              />
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { FeatureFlagsList }
