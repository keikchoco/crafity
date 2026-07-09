"use client"

import * as React from "react"
import { toast } from "sonner"
import { RefreshCwIcon } from "lucide-react"

import { refreshCacheAction } from "@/actions/settings"
import { SubmitButton } from "@/components/forms/submit-button"

function RefreshCacheButton() {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  async function handleRefresh() {
    setIsRefreshing(true)
    const response = await refreshCacheAction()
    setIsRefreshing(false)

    if (!response.success) {
      toast.error(response.error.message)
      return
    }

    toast.success("Cache refreshed. Public pages will reflect the latest content.")
  }

  return (
    <SubmitButton
      type="button"
      variant="outline"
      isSubmitting={isRefreshing}
      submittingLabel="Refreshing..."
      onClick={handleRefresh}
    >
      <RefreshCwIcon />
      Refresh cache
    </SubmitButton>
  )
}

export { RefreshCacheButton }
