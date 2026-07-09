import { Row, Column, Section, Text } from "@react-email/components"

interface SummaryRow {
  label: string
  value: string
}

interface SummaryCardProps {
  title: string
  rows: SummaryRow[]
}

function SummaryCard({ title, rows }: SummaryCardProps) {
  return (
    <Section className="mb-6 rounded-xl border border-solid border-[#e4e4e7] bg-[#fafafa] px-5 py-4">
      <Text className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
        {title}
      </Text>
      {rows.map((row, index) => (
        <Row key={row.label} className={index === rows.length - 1 ? "" : "mb-2"}>
          <Column className="w-[120px] align-top">
            <Text className="m-0 text-[12px] text-[#a1a1aa]">{row.label}</Text>
          </Column>
          <Column className="align-top">
            <Text className="m-0 whitespace-pre-wrap text-[13px] text-[#3f3f46]">{row.value}</Text>
          </Column>
        </Row>
      ))}
    </Section>
  )
}

export { SummaryCard }
