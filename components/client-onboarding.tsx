"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, Car, User, FileText, ChevronRight, ChevronLeft, Check, Upload, Loader2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OcrUploader from "@/components/ocr-uploader"

interface ClientOnboardingProps {
  onClose: () => void
}

export default function ClientOnboarding({ onClose }: ClientOnboardingProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showOcr, setShowOcr] = useState(false)
  const [ocrData, setOcrData] = useState<any>(null)

  // Client personal information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
    city: "",
    postalCode: "",
    occupation: "",
  })

  // Vehicle information
  const [vehicleInfo, setVehicleInfo] = useState({
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    color: "",
    fuelType: "petrol",
    transmission: "manual",
    seatingCapacity: "5",
    value: "1500000",
    usage: "personal",
    financedVehicle: false,
    financierName: "",
  })

  // Insurance details
  const [insuranceInfo, setInsuranceInfo] = useState({
    coverType: "comprehensive",
    period: "annual",
    startDate: new Date().toISOString().split("T")[0],
    previousInsurer: "",
    claimHistory: "none",
    noClaimsBonus: false,
    additionalDrivers: "0",
    excessProtection: false,
    roadRescue: false,
    politicalViolence: false,
    passengerLiability: false,
  })

  // Document uploads
  const [documents, setDocuments] = useState({
    idUploaded: false,
    logbookUploaded: false,
    previousPolicyUploaded: false,
  })

  const updatePersonalInfo = (field: string, value: any) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
  }

  const updateVehicleInfo = (field: string, value: any) => {
    setVehicleInfo((prev) => ({ ...prev, [field]: value }))
  }

  const updateInsuranceInfo = (field: string, value: any) => {
    setInsuranceInfo((prev) => ({ ...prev, [field]: value }))
  }

  const updateDocuments = (field: string, value: boolean) => {
    setDocuments((prev) => ({ ...prev, [field]: value }))
  }

  const handleOcrComplete = (extractedData: any) => {
    setOcrData(extractedData)
    setShowOcr(false)

    // Auto-fill form with OCR data if available
    if (extractedData) {
      if (extractedData.vehicleInfo) {
        const vInfo = extractedData.vehicleInfo
        if (vInfo.registrationNumber) updateVehicleInfo("registrationNumber", vInfo.registrationNumber)
        if (vInfo.chassisNumber) updateVehicleInfo("chassisNumber", vInfo.chassisNumber)
        if (vInfo.make) updateVehicleInfo("make", vInfo.make)
        if (vInfo.model) updateVehicleInfo("model", vInfo.model)
        if (vInfo.year) updateVehicleInfo("year", vInfo.year)
      }

      if (extractedData.ownerInfo) {
        const oInfo = extractedData.ownerInfo
        if (oInfo.name) {
          const nameParts = oInfo.name.split(" ")
          if (nameParts.length > 0) updatePersonalInfo("firstName", nameParts[0])
          if (nameParts.length > 1) updatePersonalInfo("lastName", nameParts.slice(1).join(" "))
        }
        if (oInfo.idNumber) updatePersonalInfo("idNumber", oInfo.idNumber)
      }

      toast({
        title: "Document processed successfully",
        description: "Form has been auto-filled with available information",
      })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Client onboarded successfully",
      description: "The client has been added to your portfolio",
    })

    setLoading(false)
    onClose()
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderPersonalInfoForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
            placeholder="John"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="idNumber">ID/Passport Number</Label>
          <Input
            id="idNumber"
            value={personalInfo.idNumber}
            onChange={(e) => updatePersonalInfo("idNumber", e.target.value)}
            placeholder="12345678"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={personalInfo.phoneNumber}
            onChange={(e) => updatePersonalInfo("phoneNumber", e.target.value)}
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            placeholder="john.doe@example.com"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Physical Address</Label>
        <Input
          id="address"
          value={personalInfo.address}
          onChange={(e) => updatePersonalInfo("address", e.target.value)}
          placeholder="123 Moi Avenue"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City/Town</Label>
          <Select value={personalInfo.city} onValueChange={(value) => updatePersonalInfo("city", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
              <SelectItem value="nakuru">Nakuru</SelectItem>
              <SelectItem value="eldoret">Eldoret</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={personalInfo.postalCode}
            onChange={(e) => updatePersonalInfo("postalCode", e.target.value)}
            placeholder="00100"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <Input
          id="occupation"
          value={personalInfo.occupation}
          onChange={(e) => updatePersonalInfo("occupation", e.target.value)}
          placeholder="Business Owner"
        />
      </div>
    </div>
  )

  const renderVehicleInfoForm = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Vehicle Details</h3>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={() => setShowOcr(true)}
        >
          <FileText className="h-3 w-3" />
          Scan Logbook
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="registrationNumber">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={vehicleInfo.registrationNumber}
            onChange={(e) => updateVehicleInfo("registrationNumber", e.target.value)}
            placeholder="KAA 123A"
          />
        </div>
        <div>
          <Label htmlFor="chassisNumber">Chassis Number</Label>
          <Input
            id="chassisNumber"
            value={vehicleInfo.chassisNumber}
            onChange={(e) => updateVehicleInfo("chassisNumber", e.target.value)}
            placeholder="ABCD1234567890"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="engineNumber">Engine Number</Label>
        <Input
          id="engineNumber"
          value={vehicleInfo.engineNumber}
          onChange={(e) => updateVehicleInfo("engineNumber", e.target.value)}
          placeholder="ENG1234567890"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={vehicleInfo.make}
            onChange={(e) => updateVehicleInfo("make", e.target.value)}
            placeholder="Toyota"
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={vehicleInfo.model}
            onChange={(e) => updateVehicleInfo("model", e.target.value)}
            placeholder="Corolla"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="year">Year of Manufacture</Label>
          <Input
            id="year"
            value={vehicleInfo.year}
            onChange={(e) => updateVehicleInfo("year", e.target.value)}
            placeholder="2022"
          />
        </div>
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={vehicleInfo.color}
            onChange={(e) => updateVehicleInfo("color", e.target.value)}
            placeholder="Silver"
          />
        </div>
        <div>
          <Label htmlFor="seatingCapacity">Seating Capacity</Label>
          <Select
            value={vehicleInfo.seatingCapacity}
            onValueChange={(value) => updateVehicleInfo("seatingCapacity", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="7">7</SelectItem>
              <SelectItem value="8+">8+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select value={vehicleInfo.fuelType} onValueChange={(value) => updateVehicleInfo("fuelType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select value={vehicleInfo.transmission} onValueChange={(value) => updateVehicleInfo("transmission", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">Vehicle Value (KSh)</Label>
          <Input
            id="value"
            type="number"
            value={vehicleInfo.value}
            onChange={(e) => updateVehicleInfo("value", e.target.value)}
            placeholder="1,500,000"
          />
        </div>
        <div>
          <Label htmlFor="usage">Vehicle Usage</Label>
          <Select value={vehicleInfo.usage} onValueChange={(value) => updateVehicleInfo("usage", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="psv">PSV</SelectItem>
              <SelectItem value="taxi">Taxi/Uber</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="financedVehicle"
          checked={vehicleInfo.financedVehicle}
          onCheckedChange={(checked) => updateVehicleInfo("financedVehicle", checked)}
        />
        <Label htmlFor="financedVehicle">This is a financed vehicle</Label>
      </div>

      {vehicleInfo.financedVehicle && (
        <div>
          <Label htmlFor="financierName">Financier Name</Label>
          <Input
            id="financierName"
            value={vehicleInfo.financierName}
            onChange={(e) => updateVehicleInfo("financierName", e.target.value)}
            placeholder="Bank/Financial Institution"
          />
        </div>
      )}
    </div>
  )

  const renderInsuranceDetailsForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="coverType" className="mb-2 block">
          Cover Type
        </Label>
        <RadioGroup
          value={insuranceInfo.coverType}
          onValueChange={(value) => updateInsuranceInfo("coverType", value)}
          className="grid grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="comprehensive" id="comprehensive" />
            <Label htmlFor="comprehensive" className="cursor-pointer">
              Comprehensive
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="thirdParty" id="thirdParty" />
            <Label htmlFor="thirdParty" className="cursor-pointer">
              Third Party
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="thirdPartyFireTheft" id="thirdPartyFireTheft" />
            <Label htmlFor="thirdPartyFireTheft" className="cursor-pointer">
              TP Fire & Theft
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="period">Insurance Period</Label>
          <Select value={insuranceInfo.period} onValueChange={(value) => updateInsuranceInfo("period", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="semiAnnual">6 Months</SelectItem>
              <SelectItem value="quarterly">3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={insuranceInfo.startDate}
            onChange={(e) => updateInsuranceInfo("startDate", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="previousInsurer">Previous Insurer (if any)</Label>
          <Input
            id="previousInsurer"
            value={insuranceInfo.previousInsurer}
            onChange={(e) => updateInsuranceInfo("previousInsurer", e.target.value)}
            placeholder="Insurance Company"
          />
        </div>
        <div>
          <Label htmlFor="claimHistory">Claim History</Label>
          <Select
            value={insuranceInfo.claimHistory}
            onValueChange={(value) => updateInsuranceInfo("claimHistory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select claim history" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Claims</SelectItem>
              <SelectItem value="oneClaim">1 Claim in Last 3 Years</SelectItem>
              <SelectItem value="twoClaims">2 Claims in Last 3 Years</SelectItem>
              <SelectItem value="moreClaims">More than 2 Claims</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="noClaimsBonus"
          checked={insuranceInfo.noClaimsBonus}
          onCheckedChange={(checked) => updateInsuranceInfo("noClaimsBonus", checked)}
        />
        <Label htmlFor="noClaimsBonus">No Claims Bonus from Previous Insurer</Label>
      </div>

      <div>
        <Label htmlFor="additionalDrivers">Additional Drivers</Label>
        <Select
          value={insuranceInfo.additionalDrivers}
          onValueChange={(value) => updateInsuranceInfo("additionalDrivers", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of additional drivers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            <SelectItem value="1">1 Additional Driver</SelectItem>
            <SelectItem value="2">2 Additional Drivers</SelectItem>
            <SelectItem value="3+">3+ Additional Drivers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Additional Coverage Options</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <Checkbox
              id="excessProtection"
              checked={insuranceInfo.excessProtection}
              onCheckedChange={(checked) => updateInsuranceInfo("excessProtection", checked)}
            />
            <Label htmlFor="excessProtection" className="cursor-pointer text-sm">
              Excess Protection
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <Checkbox
              id="roadRescue"
              checked={insuranceInfo.roadRescue}
              onCheckedChange={(checked) => updateInsuranceInfo("roadRescue", checked)}
            />
            <Label htmlFor="roadRescue" className="cursor-pointer text-sm">
              Road Rescue
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <Checkbox
              id="politicalViolence"
              checked={insuranceInfo.politicalViolence}
              onCheckedChange={(checked) => updateInsuranceInfo("politicalViolence", checked)}
            />
            <Label htmlFor="politicalViolence" className="cursor-pointer text-sm">
              Political Violence
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <Checkbox
              id="passengerLiability"
              checked={insuranceInfo.passengerLiability}
              onCheckedChange={(checked) => updateInsuranceInfo("passengerLiability", checked)}
            />
            <Label htmlFor="passengerLiability" className="cursor-pointer text-sm">
              Passenger Liability
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDocumentsForm = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Required Documents</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please upload the following documents to complete the onboarding process.
        </p>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">ID/Passport</span>
              </div>
              {documents.idUploaded ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Uploaded
                </div>
              ) : (
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">Upload a clear copy of the client's ID or passport</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Vehicle Logbook</span>
              </div>
              {documents.logbookUploaded ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Uploaded
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setShowOcr(true)
                    updateDocuments("logbookUploaded", true)
                  }}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">Upload a clear copy of the vehicle logbook (front and back)</p>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Previous Insurance Policy (if applicable)</span>
              </div>
              {documents.previousPolicyUploaded ? (
                <div className="flex items-center text-green-600 text-sm">
                  <Check className="h-4 w-4 mr-1" />
                  Uploaded
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => updateDocuments("previousPolicyUploaded", true)}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500">Upload a copy of the previous insurance policy if available</p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex gap-2">
          <FileText className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-orange-800">Document Verification</p>
            <p className="text-orange-700">
              All documents will be verified before policy issuance. Please ensure all uploads are clear and legible.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoForm()
      case 2:
        return renderVehicleInfoForm()
      case 3:
        return renderInsuranceDetailsForm()
      case 4:
        return renderDocumentsForm()
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information"
      case 2:
        return "Vehicle Details"
      case 3:
        return "Insurance Requirements"
      case 4:
        return "Document Upload"
      default:
        return ""
    }
  }

  return (
    <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
      <CardHeader className="pb-2 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {currentStep === 1 && <User className="h-5 w-5 text-purple-600" />}
            {currentStep === 2 && <Car className="h-5 w-5 text-purple-600" />}
            {currentStep === 3 && <Shield className="h-5 w-5 text-purple-600" />}
            {currentStep === 4 && <FileText className="h-5 w-5 text-purple-600" />}
            <CardTitle>Client Onboarding - {getStepTitle()}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Step {currentStep} of 4</CardDescription>
      </CardHeader>

      <div className="px-6 pt-2">
        <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <CardContent className="overflow-y-auto max-h-[60vh] pb-6">{renderStepContent()}</CardContent>

      <CardFooter className="flex justify-between sticky bottom-0 bg-white z-10 pt-4 border-t">
        {currentStep > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}

        {currentStep < 4 ? (
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={nextStep}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Onboarding"
            )}
          </Button>
        )}
      </CardFooter>

      {/* OCR Modal */}
      {showOcr && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <OcrUploader onClose={() => setShowOcr(false)} onComplete={handleOcrComplete} />
        </div>
      )}
    </Card>
  )
}

