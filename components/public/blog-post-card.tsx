import Link from "next/link"
import Image from "next/image"
import { ArrowUpRightIcon } from "lucide-react"

import type { BlogPost } from "@/types/blog"

interface BlogPostCardProps {
  post: Pick<BlogPost, "slug" | "title" | "excerpt" | "coverImage" | "category" | "author" | "publishedAt">
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <ArrowUpRightIcon className="size-4" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {post.category}
        </span>
        <h3 className="font-heading text-lg font-medium text-foreground">{post.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <p className="text-xs text-muted-foreground">
          {post.author}
          {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString()}` : ""}
        </p>
      </div>
    </Link>
  )
}

export { BlogPostCard }
