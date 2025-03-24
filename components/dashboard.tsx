"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  MoreVertical,
  ChevronDown,
  FileText,
  Shield,
  MessageCircle,
  Info,
  User,
  BarChart2,
  Clock,
  LogOut,
  Car,
  Briefcase,
  UserPlus,
} from "lucide-react"
import OcrUploader from "@/components/ocr-uploader"
import QuoteGenerator from "@/components/quote-generator"
import ClientOnboarding from "@/components/client-onboarding"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [showOcr, setShowOcr] = useState(false)
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false)
  const [showClientOnboarding, setShowClientOnboarding] = useState(false)
  const [quoteType, setQuoteType] = useState<"motor" | "business">("motor")
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    router.push("/login")
  }

  const openQuoteGenerator = (type: "motor" | "business") => {
    setQuoteType(type)
    setShowQuoteGenerator(true)
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Top Navigation */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-gray-500">My Policies</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-gray-500">Business Details</div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 border-r">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-1">Insurance Dashboard</h2>
            <p className="text-gray-500 text-sm mb-6">View and manage all your insurance policies in one place</p>

            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Personal Assistant</h3>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <Shield className="h-10 w-10 text-purple-600" />
                      </div>
                      <div className="relative">
                        <div className="bg-white rounded-full p-1 border-2 border-orange-400">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Avatar" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 border border-gray-200">
                          <MessageCircle className="h-5 w-5 text-orange-400" />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">AI Assistant</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                    <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 h-auto py-3"
                onClick={() => setShowClientOnboarding(true)}
              >
                <UserPlus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">New Client</div>
                  <div className="text-xs opacity-90">Onboard a new client</div>
                </div>
              </Button>
              <Button
                className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 h-auto py-3"
                onClick={() => setShowOcr(true)}
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Scan Document</div>
                  <div className="text-xs opacity-90">Process with OCR</div>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold">54</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div>
                <div className="text-3xl font-bold">60</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-purple-600" : "bg-gray-300"}`}></div>
              ))}
            </div>

            {/* Quick Quote Section */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Quote Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Generate instant quotes for your insurance needs</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                    onClick={() => openQuoteGenerator("motor")}
                  >
                    <Car className="h-4 w-4" />
                    Motor Insurance
                  </Button>
                  <Button
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500"
                    onClick={() => openQuoteGenerator("business")}
                  >
                    <Briefcase className="h-4 w-4" />
                    Business Insurance
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-100 rounded-md mb-6">
              <div className="p-4 flex justify-between items-center border-b">
                <div className="flex items-center gap-2">
                  <div>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                  <div className="font-medium">Financial Summary</div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 text-white">
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <Avatar className="mx-auto mb-2 bg-gray-700">
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">Payment History</div>
                  </div>
                  <div>
                    <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <div className="text-xl font-bold">0%</div>
                    </div>
                    <div className="text-xs">Premium Change</div>
                  </div>
                  <div>
                    <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <div>KSh</div>
                    </div>
                    <div className="text-xs">Claims & Refunds</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-center mb-4">Payment Section</h3>
                  <div className="grid grid-cols-4 text-center text-xs gap-2">
                    <div>Subscriptions</div>
                    <div>Payment Goals</div>
                    <div>Transactions</div>
                    <div>Statements</div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="h-1 bg-blue-400 flex-1 rounded-full"></div>
                  <div className="h-1 bg-gray-400 flex-1 rounded-full"></div>
                  <div className="h-1 bg-orange-400 flex-1 rounded-full"></div>
                </div>

                <div className="grid grid-cols-4 text-center text-xs gap-2">
                  <div>Transactions</div>
                  <div>Payment History</div>
                  <div>Invoices</div>
                  <div>Payment Schedule</div>
                  <div>Statements</div>
                  <div>Receipts</div>
                  <div>History</div>
                  <div>Forecasts</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-purple-600" : "bg-gray-300"}`}></div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Add Policy
              </Button>
              <Button variant="outline" className="flex-1">
                File Claim
              </Button>
              <Button variant="outline" className="flex-1">
                Get Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Policy Management</h2>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-gray-500 text-sm mb-6">Manage your insurance policies and claims in one place</p>

            <Button className="w-full bg-orange-400 hover:bg-orange-500 mb-6">View All Policies</Button>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Add & Review</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Policy Actions</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Info className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Help Center</div>
              </div>
            </div>

            <div className="flex justify-center mb-2">
              <ChevronDown className="h-5 w-5" />
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-center">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/placeholder.svg?height=56&width=56&text=User${i}`} alt={`User ${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-1 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === 0 ? "bg-purple-600" : "bg-gray-300"}`}></div>
              ))}
            </div>

            <h3 className="font-medium mb-4 text-center">Featured Services</h3>

            <div className="grid grid-cols-4 gap-4 mb-6 text-center">
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Account & Profile</div>
                <div className="text-xs">Management</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Coverage Analysis</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Risk Assessment</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-xs">Claims Follow-up</div>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Insurance Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Policy Documents</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Claims</div>
                      <div className="text-xs text-gray-500">Documentation</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-md">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Receipts</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs">Search</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs">History</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs">Security</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center mb-1">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs">Schedule</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 flex justify-center">
        <div className="h-1 w-16 bg-gray-300 rounded-full"></div>
      </div>

      {/* OCR Upload Modal */}
      {showOcr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <OcrUploader onClose={() => setShowOcr(false)} />
        </div>
      )}

      {/* Quote Generator Modal */}
      {showQuoteGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg">
            <QuoteGenerator type={quoteType} onClose={() => setShowQuoteGenerator(false)} />
          </div>
        </div>
      )}

      {/* Client Onboarding Modal */}
      {showClientOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <ClientOnboarding onClose={() => setShowClientOnboarding(false)} />
        </div>
      )}

      {/* Floating Action Button for OCR */}
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 bg-orange-400 hover:bg-orange-500"
        onClick={() => setShowOcr(true)}
      >
        <FileText className="h-6 w-6" />
      </Button>
    </div>
  )
}

