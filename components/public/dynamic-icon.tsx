import { SparklesIcon, type LucideIcon, type LucideProps } from "lucide-react"
import * as icons from "lucide-react"

interface DynamicIconProps extends LucideProps {
  name: string
}

function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const iconMap = icons as unknown as Record<string, LucideIcon>
  const Icon = iconMap[name] ?? SparklesIcon

  return <Icon {...props} />
}

export { DynamicIcon }
