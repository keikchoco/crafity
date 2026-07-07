import type { MetadataRoute } from "next"

import { projectService } from "@/services/project.service"
import { blogPostService } from "@/services/blog-post.service"
import { isFeatureEnabled } from "@/lib/feature-flags"
import { SITE_URL } from "@/lib/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact/service-inquiry`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ]

  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const { items } = await projectService.list({ status: "published" }, { limit: 200 })
    projectRoutes = items.map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }))
  } catch {
    projectRoutes = []
  }

  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    if (await isFeatureEnabled("blog.enabled")) {
      blogRoutes.push({ url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 })

      const { items } = await blogPostService.list({ status: "published" }, { limit: 200 })
      blogRoutes = blogRoutes.concat(
        items.map((post) => ({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        })),
      )
    }
  } catch {
    blogRoutes = []
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}
