"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X, Check, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

interface OcrUploaderProps {
  onClose: () => void
  onComplete?: (data: any) => void
}

export default function OcrUploader({ onClose, onComplete }: OcrUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [documentType, setDocumentType] = useState<"logbook" | "idCard" | "policy">("logbook")
  const [extractedData, setExtractedData] = useState<any>(null)
  const [step, setStep] = useState<"upload" | "verify" | "complete">("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const processImage = async () => {
    if (!file) return

    setLoading(true)

    // Simulate OCR processing
    try {
      // In a real application, you would send the file to your OCR service
      // For this prototype, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate OCR result based on document type
      let ocrText = ""
      let extractedInfo = {}

      if (documentType === "logbook") {
        ocrText = `
REPUBLIC OF KENYA
MINISTRY OF TRANSPORT
VEHICLE REGISTRATION CERTIFICATE

Registration Number: KDD 123X
Chassis Number: JTMHV05J604123456
Make: Toyota
Model: Fortuner
Year of Manufacture: 2019
Body Type: Station Wagon
Engine Number: 2GD5678901
Fuel Type: Diesel
Rating: 2755cc
Tare Weight: 2100kg
Load Capacity: 7 Passengers
Color: Silver
Date of First Registration: 12/05/2019

Owner Information:
Name: John Kamau Njoroge
ID Number: 12345678
Address: P.O. Box 12345-00100, Nairobi
`

        extractedInfo = {
          documentType: "logbook",
          vehicleInfo: {
            registrationNumber: "KDD 123X",
            chassisNumber: "JTMHV05J604123456",
            make: "Toyota",
            model: "Fortuner",
            year: "2019",
            bodyType: "Station Wagon",
            engineNumber: "2GD5678901",
            fuelType: "Diesel",
            engineCapacity: "2755cc",
            color: "Silver",
            dateRegistered: "12/05/2019",
          },
          ownerInfo: {
            name: "John Kamau Njoroge",
            idNumber: "12345678",
            address: "P.O. Box 12345-00100, Nairobi",
          },
        }
      } else if (documentType === "idCard") {
        ocrText = `
REPUBLIC OF KENYA
NATIONAL IDENTITY CARD

ID Number: 98765432
Name: MARY WANJIKU MWANGI
Sex: F
Date of Birth: 15-06-1985
District of Birth: KIAMBU
Place of Issue: NAIROBI
Date of Issue: 12-08-2010
`

        extractedInfo = {
          documentType: "idCard",
          personalInfo: {
            idNumber: "98765432",
            name: "MARY WANJIKU MWANGI",
            gender: "Female",
            dateOfBirth: "15-06-1985",
            districtOfBirth: "KIAMBU",
            placeOfIssue: "NAIROBI",
            dateOfIssue: "12-08-2010",
          },
        }
      } else if (documentType === "policy") {
        ocrText = `
INSURANCE POLICY DOCUMENT
Policy Number: MOT/2023/98765
Insured: James Omondi
Address: P.O. Box 54321-00200, Nairobi
Vehicle Reg: KCF 456G
Cover Type: Comprehensive
Period: 01/01/2023 to 31/12/2023
Premium: KSh 45,000
Sum Insured: KSh 2,500,000
Excess: KSh 20,000
Insurer: ABC Insurance Company
`

        extractedInfo = {
          documentType: "policy",
          policyInfo: {
            policyNumber: "MOT/2023/98765",
            insuredName: "James Omondi",
            address: "P.O. Box 54321-00200, Nairobi",
            vehicleReg: "KCF 456G",
            coverType: "Comprehensive",
            startDate: "01/01/2023",
            endDate: "31/12/2023",
            premium: "45,000",
            sumInsured: "2,500,000",
            excess: "20,000",
            insurer: "ABC Insurance Company",
          },
        }
      }

      setResult(ocrText)
      setExtractedData(extractedInfo)
      setStep("verify")

      toast({
        title: "Document processed successfully",
        description: "Please verify the extracted information",
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "There was an error processing your document",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setExtractedData(null)
    setStep("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleComplete = () => {
    setStep("complete")
    if (onComplete && extractedData) {
      onComplete(extractedData)
    } else {
      onClose()
    }
  }

  const renderUploadStep = () => (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Document OCR Processing</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Upload a document to extract information automatically</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logbook" onValueChange={(value) => setDocumentType(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="logbook">Logbook</TabsTrigger>
            <TabsTrigger value="idCard">ID Card</TabsTrigger>
            <TabsTrigger value="policy">Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="logbook">
            <p className="text-sm text-gray-500 mb-4">
              Upload a clear image of the vehicle logbook for automatic data extraction.
            </p>
          </TabsContent>
          <TabsContent value="idCard">
            <p className="text-sm text-gray-500 mb-4">
              Upload a clear image of the ID card/passport for automatic data extraction.
            </p>
          </TabsContent>
          <TabsContent value="policy">
            <p className="text-sm text-gray-500 mb-4">
              Upload a clear image of the previous insurance policy for automatic data extraction.
            </p>
          </TabsContent>
        </Tabs>

        {!file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <FileText className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium mb-1">Upload Document</h3>
            <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        ) : (
          <div>
            {preview && (
              <div className="mb-4 relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Document preview"
                  className="w-full h-48 object-contain border rounded-md"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white rounded-full h-6 w-6"
                  onClick={resetUpload}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            <div className="text-sm mb-4">
              <div className="font-medium">{file.name}</div>
              <div className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={processImage} disabled={!file || loading} className="bg-purple-600 hover:bg-purple-700">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Document"
          )}
        </Button>
      </CardFooter>
    </>
  )

  const renderVerifyStep = () => {
    if (!extractedData) return null

    const renderExtractedFields = () => {
      if (documentType === "logbook" && extractedData.vehicleInfo) {
        const vInfo = extractedData.vehicleInfo
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Registration Number</div>
                <div className="font-medium">{vInfo.registrationNumber}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Chassis Number</div>
                <div className="font-medium">{vInfo.chassisNumber}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Make</div>
                <div className="font-medium">{vInfo.make}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Model</div>
                <div className="font-medium">{vInfo.model}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Year</div>
                <div className="font-medium">{vInfo.year}</div>
              </div>
            </div>
            {extractedData.ownerInfo && (
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Owner</div>
                <div className="font-medium">{extractedData.ownerInfo.name}</div>
              </div>
            )}
          </div>
        )
      } else if (documentType === "idCard" && extractedData.personalInfo) {
        const pInfo = extractedData.personalInfo
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">ID Number</div>
                <div className="font-medium">{pInfo.idNumber}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Name</div>
                <div className="font-medium">{pInfo.name}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Gender</div>
                <div className="font-medium">{pInfo.gender}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Date of Birth</div>
                <div className="font-medium">{pInfo.dateOfBirth}</div>
              </div>
            </div>
          </div>
        )
      } else if (documentType === "policy" && extractedData.policyInfo) {
        const pInfo = extractedData.policyInfo
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Policy Number</div>
                <div className="font-medium">{pInfo.policyNumber}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Insured Name</div>
                <div className="font-medium">{pInfo.insuredName}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Vehicle Registration</div>
                <div className="font-medium">{pInfo.vehicleReg}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Cover Type</div>
                <div className="font-medium">{pInfo.coverType}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Period</div>
                <div className="font-medium">
                  {pInfo.startDate} to {pInfo.endDate}
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Premium</div>
                <div className="font-medium">KSh {pInfo.premium}</div>
              </div>
            </div>
          </div>
        )
      }
      return null
    }

    return (
      <>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("upload")} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Verify Document Information</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Please verify the information extracted from your{" "}
            {documentType === "logbook"
              ? "vehicle logbook"
              : documentType === "idCard"
                ? "ID card"
                : "insurance policy"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              {preview && (
                <div className="w-1/3">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Document preview"
                    className="w-full h-auto object-contain border rounded-md"
                  />
                </div>
              )}
              <div className={preview ? "w-2/3" : "w-full"}>
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm text-green-800">Document Processed Successfully</h4>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    The system has extracted the following information. Please verify it's correct.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Extracted Information</h4>
                  {renderExtractedFields()}
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-gray-50 rounded-md p-3">
              <h4 className="font-medium text-sm mb-2">Raw Extracted Text</h4>
              <div className="max-h-32 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap">{result}</pre>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => setStep("upload")}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Confirm & Use Data
            </Button>
          </div>
        </CardFooter>
      </>
    )
  }

  const renderCompleteStep = () => (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Processing Complete</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Document Processed Successfully</h3>
        <p className="text-gray-500 mb-4">The information has been extracted and is ready to use.</p>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </>
  )

  return (
    <Card className="w-full max-w-2xl">
      {step === "upload" && renderUploadStep()}
      {step === "verify" && renderVerifyStep()}
      {step === "complete" && renderCompleteStep()}
    </Card>
  )
}

