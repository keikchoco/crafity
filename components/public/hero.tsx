import Link from "next/link"
import { ArrowRightIcon, ArrowDownIcon } from "lucide-react"

import { Container } from "@/components/shared/container"
import { Typography } from "@/components/shared/typography"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"

function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <Container size="lg" className="py-16 md:py-36">
        {/* <FadeIn className="flex items-center justify-between border-b border-border pb-5 text-xs tracking-widest text-muted-foreground uppercase">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            CreaThink — Website Development Studio
          </span>
          <span className="hidden sm:inline">Design × Engineering</span>
        </FadeIn> */}

        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-16">
          <SlideUp delay={0.05} className="lg:col-span-8">
            <h1 className="font-heading text-[clamp(2.75rem,8.5vw,6.5rem)] leading-[0.94] font-semibold tracking-tight text-foreground">
              Turning your
              <br />
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                ideas into
              </span>
              <br />
              digital reality
            </h1>
          </SlideUp>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:items-start">
            <SlideUp delay={0.1}>
              <Typography variant="body-lg">
                We design and build websites and digital products that are
                functional, accessible, and built to help your business grow,
                from first idea to launch.
              </Typography>
            </SlideUp>

            <SlideUp delay={0.15} className="flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/portfolio" />}>
                View Our Work
                <ArrowRightIcon />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/services" />}
              >
                Services
              </Button>
            </SlideUp>
          </div>
        </div>

        {/* <FadeIn
          delay={0.2}
          className="flex items-center justify-between border-t border-border pt-5 text-xs tracking-widest text-muted-foreground uppercase"
        >
          <span>UI/UX · Frontend · Backend · Full Stack</span>
          <span className="hidden items-center gap-1.5 sm:flex">
            Scroll
            <ArrowDownIcon className="size-3" />
          </span>
        </FadeIn> */}
      </Container>
    </div>
  )
}

export { Hero }
