import Dashboard from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-100 via-white to-purple-100">
      <div className="w-full max-w-4xl mx-auto">
        <Dashboard />
      </div>
    </main>
  )
}

