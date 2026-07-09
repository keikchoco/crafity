import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { blogPostService } from "@/services/blog-post.service"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { SITE_URL } from "@/lib/site"
import { Section } from "@/components/shared/section"
import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Stack } from "@/components/shared/stack"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    if (!(await isFeatureEnabled("blog.enabled"))) return []

    const { items } = await blogPostService.list({ status: "published" }, { limit: 200 })
    return items.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

async function getPost(slug: string) {
  if (!(await isFeatureEnabled("blog.enabled"))) notFound()

  const post = await blogPostService.getPublishedBySlug(slug)
  if (!post) notFound()
  return post
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  if (!(await isFeatureEnabled("blog.enabled"))) {
    return { title: "Not found", robots: { index: false, follow: false } }
  }

  const post = await blogPostService.getPublishedBySlug(slug)
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords,
    alternates: { canonical: post.seo?.canonicalUrl || `/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: post.seo?.ogImage ? [post.seo.ogImage] : [post.coverImage],
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "CreaThink" },
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    url: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section className="pb-0">
        <Container size="default">
          <FadeIn>
            <Stack gap="sm" className="mb-8">
              <Typography variant="caption">
                {post.category}
                {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString()}` : ""}
              </Typography>
              <Typography variant="h1">{post.title}</Typography>
              <Typography variant="body-lg">{post.excerpt}</Typography>
              <p className="text-sm text-muted-foreground">By {post.author}</p>
            </Stack>
          </FadeIn>

          <SlideUp className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </SlideUp>
        </Container>
      </Section>

      <Section>
        <Container size="default">
          <FadeIn>
            <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {post.content}
            </div>
          </FadeIn>

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-1.5 border-t border-border pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
