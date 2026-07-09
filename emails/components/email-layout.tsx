import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

import { SITE_NAME, SITE_URL } from "@/lib/site"

interface EmailLayoutProps {
  previewText: string
  children: React.ReactNode
}

function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#a8e83a",
                ink: "#0d0f0c",
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-[#f4f4f5] px-3 py-10 font-sans">
          <Container className="mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-solid border-[#e4e4e7] bg-white">
            <Section className="bg-ink px-8 py-6">
              <Text className="m-0 text-[15px] font-semibold tracking-tight text-white">
                {SITE_NAME}
              </Text>
            </Section>

            <Section className="px-8 py-8">{children}</Section>

            <Section className="border-0 border-t border-solid border-[#e4e4e7] bg-[#fafafa] px-8 py-5">
              <Text className="m-0 text-[12px] leading-5 text-[#a1a1aa]">
                {SITE_NAME} ·{" "}
                <a href={SITE_URL} className="text-[#a1a1aa] underline">
                  {SITE_URL.replace(/^https?:\/\//, "")}
                </a>
              </Text>
              <Text className="m-0 mt-1 text-[12px] leading-5 text-[#a1a1aa]">
                This is an automated message — please don&apos;t reply directly to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export { EmailLayout }
