import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentSectionProps {
  documents: {
    id: string
    title: string
    type: string
    date: string
  }[]
}

export default function DocumentSection({ documents }: DocumentSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-md">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{doc.title}</div>
                <div className="text-xs text-gray-500">
                  {doc.type} • {doc.date}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

