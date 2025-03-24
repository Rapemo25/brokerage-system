"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import QuoteGenerator from "@/components/quote-generator"
import { Car, Briefcase } from "lucide-react"

export default function PreviewDemo() {
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false)
  const [quoteType, setQuoteType] = useState<"motor" | "business">("motor")
  const [previewStep, setPreviewStep] = useState<"form" | "result">("form")

  const openQuoteGenerator = (type: "motor" | "business") => {
    setQuoteType(type)
    setShowQuoteGenerator(true)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Insurance Quote Generator Preview</h1>

      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard View</TabsTrigger>
          <TabsTrigger value="modal">Quote Generator Modal</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Quick Quote Generator</CardTitle>
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
        </TabsContent>

        <TabsContent value="modal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Motor Insurance Quote</h2>
              <Tabs defaultValue={previewStep === "form" ? "form" : "result"}>
                <TabsList className="w-full">
                  <TabsTrigger value="form" onClick={() => setPreviewStep("form")}>
                    Form View
                  </TabsTrigger>
                  <TabsTrigger value="result" onClick={() => setPreviewStep("result")}>
                    Result View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="border rounded-lg p-4 mt-4">
                  <img
                    src="/placeholder.svg?height=500&width=400&text=Motor+Insurance+Form"
                    alt="Motor Insurance Form Preview"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    <p>The motor insurance form collects:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Vehicle details (make, model, year)</li>
                      <li>Vehicle value and usage</li>
                      <li>Driver information (age, experience)</li>
                      <li>Coverage preferences</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="result" className="border rounded-lg p-4 mt-4">
                  <img
                    src="/placeholder.svg?height=500&width=400&text=Motor+Insurance+Quote+Result"
                    alt="Motor Insurance Quote Result Preview"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    <p>The quote result shows:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Premium breakdown (base, discounts, add-ons)</li>
                      <li>Coverage details and limits</li>
                      <li>Vehicle and policy information</li>
                      <li>Options to modify or save the quote</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Business Insurance Quote</h2>
              <Tabs defaultValue={previewStep === "form" ? "form" : "result"}>
                <TabsList className="w-full">
                  <TabsTrigger value="form" onClick={() => setPreviewStep("form")}>
                    Form View
                  </TabsTrigger>
                  <TabsTrigger value="result" onClick={() => setPreviewStep("result")}>
                    Result View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="form" className="border rounded-lg p-4 mt-4">
                  <img
                    src="/placeholder.svg?height=500&width=400&text=Business+Insurance+Form"
                    alt="Business Insurance Form Preview"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    <p>The business insurance form collects:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Business type and size</li>
                      <li>Revenue and years in operation</li>
                      <li>Property and inventory values</li>
                      <li>Coverage options (liability, property, cyber, etc.)</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="result" className="border rounded-lg p-4 mt-4">
                  <img
                    src="/placeholder.svg?height=500&width=400&text=Business+Insurance+Quote+Result"
                    alt="Business Insurance Quote Result Preview"
                    className="w-full rounded-lg border"
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    <p>The quote result shows:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Premium breakdown (base, discounts, add-ons)</li>
                      <li>Coverage details for each selected option</li>
                      <li>Business information summary</li>
                      <li>Options to modify or save the quote</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              1
            </div>
            <h3 className="font-bold mb-2">Select Quote Type</h3>
            <p className="text-sm text-gray-500">
              Choose between motor insurance or business insurance based on your needs.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              2
            </div>
            <h3 className="font-bold mb-2">Fill in Details</h3>
            <p className="text-sm text-gray-500">
              Provide information about your vehicle or business to get an accurate quote.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              3
            </div>
            <h3 className="font-bold mb-2">Review Quote</h3>
            <p className="text-sm text-gray-500">
              Get an instant premium calculation with detailed coverage information.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">Ready to try the quote generator?</p>
        <div className="flex justify-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => openQuoteGenerator("motor")}>
            <Car className="h-4 w-4 mr-2" />
            Generate Motor Quote
          </Button>
          <Button className="bg-orange-400 hover:bg-orange-500" onClick={() => openQuoteGenerator("business")}>
            <Briefcase className="h-4 w-4 mr-2" />
            Generate Business Quote
          </Button>
        </div>
      </div>

      {/* Quote Generator Modal */}
      {showQuoteGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <QuoteGenerator type={quoteType} onClose={() => setShowQuoteGenerator(false)} />
        </div>
      )}
    </div>
  )
}

