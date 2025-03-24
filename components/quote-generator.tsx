"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { X, Car, Briefcase, Check, Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateInsuranceQuote } from "@/lib/ai-service"

interface QuoteGeneratorProps {
  type: "motor" | "business"
  onClose: () => void
}

// Helper function to format currency in KSh
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function QuoteGenerator({ type, onClose }: QuoteGeneratorProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<any>(null)
  const [step, setStep] = useState(1)

  // Motor insurance form state
  const [motorForm, setMotorForm] = useState({
    vehicleType: "car",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    value: 1500000, // Higher value in KSh
    usage: "personal",
    mileage: 10000,
    driverAge: 35,
    driverExperience: 10,
    previousClaims: 0,
    coverageType: "comprehensive",
  })

  // Business insurance form state
  const [businessForm, setBusinessForm] = useState({
    businessType: "retail",
    employees: "1-10",
    revenue: "5000000", // Higher value in KSh
    yearsInBusiness: "1-5",
    location: "",
    buildingValue: 25000000, // Higher value in KSh
    inventoryValue: 10000000, // Higher value in KSh
    liabilityCoverage: true,
    propertyDamage: true,
    businessInterruption: true,
    cyberInsurance: false,
    professionalLiability: false,
  })

  const updateMotorForm = (field: string, value: any) => {
    setMotorForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateBusinessForm = (field: string, value: any) => {
    setBusinessForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateQuote = async () => {
    setLoading(true)

    try {
      // In a real app, you would send the form data to your backend
      // For this prototype, we'll use our mock quote generator
      const formData = type === "motor" ? motorForm : businessForm

      // Use AI service to generate a quote
      const quoteResult = await generateInsuranceQuote(type, formData)
      setQuote(quoteResult)

      toast({
        title: "Quote generated successfully",
        description: "Your insurance quote is ready to review",
      })

      setStep(2)
    } catch (error) {
      console.error("Error generating quote:", error)
      toast({
        title: "Error generating quote",
        description: "There was a problem generating your quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update the renderQuoteResult function to use the quote object properly

  const renderQuoteResult = () => {
    const isMotor = type === "motor"

    // Use the quote object if available, otherwise use default values
    const basePrice = quote ? quote.basePremium : 0
    const discount = quote ? quote.discount : 0
    const additionalCoverage = quote ? quote.additionalCoverage : 0
    const totalPrice = quote ? quote.premium : 0

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-1">Quote Generated Successfully</h3>
          <p className="text-gray-500">Here's your personalized insurance quote</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">{isMotor ? "Motor Insurance" : "Business Insurance"}</h4>
              <p className="text-sm text-gray-500">
                {isMotor
                  ? `${motorForm.year} ${motorForm.make} ${motorForm.model}`
                  : `${businessForm.businessType} Business`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(totalPrice)}</div>
              <div className="text-sm text-gray-500">Annual Premium</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Base Premium</span>
              <span>{formatCurrency(basePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discounts</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Additional Coverage</span>
              <span>{formatCurrency(additionalCoverage)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total Annual Premium</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">This is a preliminary quote</p>
                <p className="text-orange-700">Final pricing may vary based on additional underwriting factors.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Coverage Details</h4>
            {isMotor ? (
              <ul className="text-sm space-y-1">
                <li>
                  • Coverage Type: {motorForm.coverageType.charAt(0).toUpperCase() + motorForm.coverageType.slice(1)}
                </li>
                <li>• Vehicle Value: {formatCurrency(motorForm.value)}</li>
                <li>• Deductible: KSh 50,000</li>
                <li>• Liability Coverage: KSh 3,000,000</li>
                <li>• Uninsured Motorist: Included</li>
                <li>• Roadside Assistance: Included</li>
              </ul>
            ) : (
              <ul className="text-sm space-y-1">
                <li>• Property Coverage: {formatCurrency(businessForm.buildingValue)}</li>
                <li>• Inventory Coverage: {formatCurrency(businessForm.inventoryValue)}</li>
                <li>• Liability Coverage: {businessForm.liabilityCoverage ? "Included" : "Not Included"}</li>
                <li>• Business Interruption: {businessForm.businessInterruption ? "Included" : "Not Included"}</li>
                <li>• Cyber Insurance: {businessForm.cyberInsurance ? "Included" : "Not Included"}</li>
                <li>• Professional Liability: {businessForm.professionalLiability ? "Included" : "Not Included"}</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderMotorForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Select value={motorForm.vehicleType} onValueChange={(value) => updateMotorForm("vehicleType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="usage">Vehicle Usage</Label>
          <Select value={motorForm.usage} onValueChange={(value) => updateMotorForm("usage", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input id="make" value={motorForm.make} onChange={(e) => updateMotorForm("make", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input id="model" value={motorForm.model} onChange={(e) => updateMotorForm("model", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={motorForm.year}
            onChange={(e) => updateMotorForm("year", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="value">Vehicle Value (KSh)</Label>
          <Input
            id="value"
            type="number"
            value={motorForm.value}
            onChange={(e) => updateMotorForm("value", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage">Annual Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={motorForm.mileage}
            onChange={(e) => updateMotorForm("mileage", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="previousClaims">Previous Claims</Label>
          <Input
            id="previousClaims"
            type="number"
            value={motorForm.previousClaims}
            onChange={(e) => updateMotorForm("previousClaims", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="driverAge">Driver Age: {motorForm.driverAge}</Label>
        <Slider
          defaultValue={[motorForm.driverAge]}
          max={75}
          min={18}
          step={1}
          onValueChange={(value) => updateMotorForm("driverAge", value[0])}
        />
      </div>

      <div>
        <Label htmlFor="driverExperience">Driving Experience: {motorForm.driverExperience} years</Label>
        <Slider
          defaultValue={[motorForm.driverExperience]}
          max={50}
          min={0}
          step={1}
          onValueChange={(value) => updateMotorForm("driverExperience", value[0])}
        />
      </div>

      <div>
        <Label htmlFor="coverageType">Coverage Type</Label>
        <Select value={motorForm.coverageType} onValueChange={(value) => updateMotorForm("coverageType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select coverage type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comprehensive">Comprehensive</SelectItem>
            <SelectItem value="thirdParty">Third Party</SelectItem>
            <SelectItem value="thirdPartyFireTheft">Third Party, Fire & Theft</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderBusinessForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Select
            value={businessForm.businessType}
            onValueChange={(value) => updateBusinessForm("businessType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="employees">Number of Employees</Label>
          <Select value={businessForm.employees} onValueChange={(value) => updateBusinessForm("employees", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select number of employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10</SelectItem>
              <SelectItem value="11-50">11-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201+">201+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="revenue">Annual Revenue</Label>
          <Select value={businessForm.revenue} onValueChange={(value) => updateBusinessForm("revenue", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select annual revenue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000000">Under KSh 1,000,000</SelectItem>
              <SelectItem value="5000000">KSh 1,000,000 - KSh 5,000,000</SelectItem>
              <SelectItem value="10000000">KSh 5,000,000 - KSh 10,000,000</SelectItem>
              <SelectItem value="50000000">KSh 10,000,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="yearsInBusiness">Years in Business</Label>
          <Select
            value={businessForm.yearsInBusiness}
            onValueChange={(value) => updateBusinessForm("yearsInBusiness", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select years in business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-5">1-5</SelectItem>
              <SelectItem value="6-10">6-10</SelectItem>
              <SelectItem value="11-20">11-20</SelectItem>
              <SelectItem value="21+">21+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Business Location</Label>
        <Input
          id="location"
          value={businessForm.location}
          onChange={(e) => updateBusinessForm("location", e.target.value)}
          placeholder="e.g., Nairobi, Mombasa, Kisumu"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buildingValue">Building Value (KSh)</Label>
          <Input
            id="buildingValue"
            type="number"
            value={businessForm.buildingValue}
            onChange={(e) => updateBusinessForm("buildingValue", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="inventoryValue">Inventory Value (KSh)</Label>
          <Input
            id="inventoryValue"
            type="number"
            value={businessForm.inventoryValue}
            onChange={(e) => updateBusinessForm("inventoryValue", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="block mb-2">Coverage Options</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between border p-2 rounded">
            <Label htmlFor="liabilityCoverage" className="cursor-pointer text-sm">
              Liability Coverage
            </Label>
            <Switch
              id="liabilityCoverage"
              checked={businessForm.liabilityCoverage}
              onCheckedChange={(checked) => updateBusinessForm("liabilityCoverage", checked)}
            />
          </div>
          <div className="flex items-center justify-between border p-2 rounded">
            <Label htmlFor="propertyDamage" className="cursor-pointer text-sm">
              Property Damage
            </Label>
            <Switch
              id="propertyDamage"
              checked={businessForm.propertyDamage}
              onCheckedChange={(checked) => updateBusinessForm("propertyDamage", checked)}
            />
          </div>
          <div className="flex items-center justify-between border p-2 rounded">
            <Label htmlFor="businessInterruption" className="cursor-pointer text-sm">
              Business Interruption
            </Label>
            <Switch
              id="businessInterruption"
              checked={businessForm.businessInterruption}
              onCheckedChange={(checked) => updateBusinessForm("businessInterruption", checked)}
            />
          </div>
          <div className="flex items-center justify-between border p-2 rounded">
            <Label htmlFor="cyberInsurance" className="cursor-pointer text-sm">
              Cyber Insurance
            </Label>
            <Switch
              id="cyberInsurance"
              checked={businessForm.cyberInsurance}
              onCheckedChange={(checked) => updateBusinessForm("cyberInsurance", checked)}
            />
          </div>
          <div className="flex items-center justify-between border p-2 rounded">
            <Label htmlFor="professionalLiability" className="cursor-pointer text-sm">
              Professional Liability
            </Label>
            <Switch
              id="professionalLiability"
              checked={businessForm.professionalLiability}
              onCheckedChange={(checked) => updateBusinessForm("professionalLiability", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden">
      <CardHeader className="pb-2 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {type === "motor" ? (
              <Car className="h-5 w-5 text-purple-600" />
            ) : (
              <Briefcase className="h-5 w-5 text-orange-500" />
            )}
            <CardTitle>{type === "motor" ? "Motor Insurance Quote" : "Business Insurance Quote"}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          {step === 1
            ? "Fill in the details below to get your personalized quote"
            : "Review your personalized insurance quote"}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[60vh] pb-6">
        {step === 1 ? (type === "motor" ? renderMotorForm() : renderBusinessForm()) : renderQuoteResult()}
      </CardContent>
      <CardFooter className="flex justify-between sticky bottom-0 bg-white z-10 pt-4 border-t">
        {step === 1 ? (
          <>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateQuote}
              disabled={loading}
              className={type === "motor" ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-400 hover:bg-orange-500"}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                "Generate Quote"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep(1)}>
              Modify Quote
            </Button>
            <Button
              className={type === "motor" ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-400 hover:bg-orange-500"}
              onClick={onClose}
            >
              Save Quote
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

