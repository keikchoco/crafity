import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { blogPostService } from "@/services/blog-post.service"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { SectionLabel } from "@/components/shared/section-label"
import { EmptyState } from "@/components/shared/empty-state"
import { BlogPostCard } from "@/components/public/blog-post-card"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

export async function generateMetadata(): Promise<Metadata> {
  if (!(await isFeatureEnabled("blog.enabled"))) {
    return { title: "Not found", robots: { index: false, follow: false } }
  }

  return {
    title: "Blog",
    description: "Insights on design, engineering, and building digital products from the Crafity team.",
    alternates: { canonical: "/blog" },
  }
}

export default async function BlogPage() {
  if (!(await isFeatureEnabled("blog.enabled"))) {
    notFound()
  }

  const { items } = await blogPostService.list({ status: "published" }, { limit: 50, sort: "-publishedAt" })

  return (
    <Section>
      <Container size="lg">
        <FadeIn>
          <Stack gap="sm" className="mb-10 max-w-2xl">
            <SectionLabel index="01">Blog</SectionLabel>
            <Typography variant="h1">Notes on design & engineering</Typography>
          </Stack>
        </FadeIn>

        {items.length === 0 ? (
          <EmptyState title="No posts yet" description="Check back soon for new articles." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post, index) => (
              <SlideUp key={post.slug} delay={(index % 6) * 0.06}>
                <BlogPostCard
                  post={{
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    coverImage: post.coverImage,
                    category: post.category,
                    author: post.author,
                    publishedAt: post.publishedAt,
                  }}
                />
              </SlideUp>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
