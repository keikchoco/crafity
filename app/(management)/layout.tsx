import { Navbar, type NavLink } from "@/components/shared/navbar"
import { Footer, type FooterColumn } from "@/components/shared/footer"
import { Backdrop } from "@/components/shared/backdrop"
import { isFeatureEnabled } from "@/lib/feature-flags"

export default async function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const blogEnabled = await isFeatureEnabled("blog.enabled")

  const links: NavLink[] = [
    { label: "Work", href: "/portfolio" },
    { label: "Services", href: "/services" },
    ...(blogEnabled ? [{ label: "Blog", href: "/blog" }] : []),
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  const footerColumns: FooterColumn[] = [
    {
      title: "Sitemap",
      links: [
        { label: "Work", href: "/portfolio" },
        { label: "Services", href: "/services" },
        { label: "About", href: "/about" },
        ...(blogEnabled ? [{ label: "Blog", href: "/blog" }] : []),
      ],
    },
    {
      title: "Get in touch",
      links: [
        { label: "hello@crafity.com", href: "mailto:hello@crafity.com" },
        { label: "Start a Project", href: "/contact/service-inquiry" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
  ]

  return (
    <>
      <Backdrop />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar links={links} />
        <main className="flex-1">{children}</main>
        <Footer
          description="A creative development studio building premium websites and digital products through thoughtful design and scalable engineering."
          columns={footerColumns}
        />
      </div>
    </>
  )
}
