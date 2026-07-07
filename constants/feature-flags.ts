export interface FeatureFlagDefinition {
  key: string
  label: string
  description: string
  defaultEnabled: boolean
}

export const FEATURE_FLAG_DEFINITIONS: FeatureFlagDefinition[] = [
  {
    key: "blog.enabled",
    label: "Blog",
    description: "Controls whether the blog is visible in navigation and reachable publicly.",
    defaultEnabled: false,
  },
  {
    key: "contact.enabled",
    label: "Contact Form",
    description: "Controls whether the general contact form accepts submissions.",
    defaultEnabled: true,
  },
  {
    key: "serviceInquiry.enabled",
    label: "Service Inquiry Form",
    description: "Controls whether the service inquiry form accepts submissions.",
    defaultEnabled: true,
  },
]

export function getFeatureFlagDefault(key: string): boolean {
  return FEATURE_FLAG_DEFINITIONS.find((flag) => flag.key === key)?.defaultEnabled ?? false
}
