import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, AlertTriangle } from "lucide-react"

interface InsuranceCardProps {
  title: string
  description: string
  type: "policy" | "claim" | "alert"
  status?: string
  amount?: string
}

export default function InsuranceCard({ title, description, type, status, amount }: InsuranceCardProps) {
  const getIcon = () => {
    switch (type) {
      case "policy":
        return <Shield className="h-5 w-5 text-purple-600" />
      case "claim":
        return <FileText className="h-5 w-5 text-orange-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-purple-600" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {getIcon()}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{description}</p>
        {status && (
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">{status}</span>
            {amount && <span className="text-sm font-bold">{amount}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

