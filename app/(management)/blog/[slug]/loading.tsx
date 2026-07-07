import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <Section>
      <Container size="default">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-4 h-12 w-2/3" />
        <Skeleton className="mb-10 h-6 w-1/2" />
        <Skeleton className="aspect-video w-full" />
      </Container>
    </Section>
  )
}
