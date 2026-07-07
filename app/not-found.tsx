import Link from "next/link"

import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center">
      <Container size="default">
        <Stack align="center" gap="lg" className="text-center">
          <span className="font-heading text-sm text-primary">404</span>
          <Typography variant="h1">Page not found</Typography>
          <Typography variant="body-lg" className="max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </Typography>
          <Button size="lg" render={<Link href="/" />}>
            Back to home
          </Button>
        </Stack>
      </Container>
    </div>
  )
}
