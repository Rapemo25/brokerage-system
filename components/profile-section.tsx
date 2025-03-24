import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProfileSectionProps {
  profiles: {
    id: string
    name: string
    role: string
    avatar: string
    status: "active" | "pending" | "inactive"
  }[]
}

export default function ProfileSection({ profiles }: ProfileSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {profiles.map((profile) => (
        <Card key={profile.id} className="overflow-hidden">
          <CardContent className="p-4 text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-medium text-sm">{profile.name}</h3>
            <p className="text-xs text-gray-500">{profile.role}</p>
            <Badge
              variant={profile.status === "active" ? "default" : profile.status === "pending" ? "secondary" : "outline"}
              className="mt-2"
            >
              {profile.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

