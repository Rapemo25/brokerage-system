import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileText, MessageCircle, Info } from "lucide-react"

interface FeatureSectionProps {
  features: {
    id: string
    title: string
    icon: "shield" | "file" | "message" | "info"
    description: string
  }[]
}

export default function FeatureSection({ features }: FeatureSectionProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case "shield":
        return <Shield className="h-6 w-6 text-purple-600" />
      case "file":
        return <FileText className="h-6 w-6 text-orange-500" />
      case "message":
        return <MessageCircle className="h-6 w-6 text-blue-500" />
      case "info":
        return <Info className="h-6 w-6 text-green-500" />
      default:
        return <Shield className="h-6 w-6 text-purple-600" />
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {features.map((feature) => (
        <Card key={feature.id} className="border-none shadow-none">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              {getIcon(feature.icon)}
            </div>
            <h3 className="font-medium text-sm">{feature.title}</h3>
            <p className="text-xs text-gray-500">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

