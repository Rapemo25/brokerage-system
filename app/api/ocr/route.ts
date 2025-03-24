import { type NextRequest, NextResponse } from "next/server"

// This is a mock OCR service
// In a real application, you would integrate with a service like
// Google Cloud Vision, Azure Computer Vision, or Tesseract.js

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be an image or PDF" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Upload the file to a storage service
    // 2. Call an OCR API to process the file
    // 3. Return the extracted text

    // For this prototype, we'll simulate OCR processing with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock OCR result based on file type
    let mockText = ""

    if (file.type.startsWith("image/")) {
      mockText = `
Policy Number: INS-2023-45678
Client: John Doe
Address: 123 Main St, Anytown, USA
Coverage: $500,000
Premium: $1,200/year
Effective Date: 01/01/2023
Expiration Date: 12/31/2023
Coverage Type: Comprehensive
Deductible: $500
      `.trim()
    } else if (file.type === "application/pdf") {
      mockText = `
INSURANCE POLICY DOCUMENT
Policy Number: PDF-2023-98765
Insured: Jane Smith
Address: 456 Oak Ave, Somewhere, USA
Coverage Amount: $750,000
Annual Premium: $1,850
Term: 12 months
Start Date: 03/15/2023
End Date: 03/14/2024
Coverage Details:
- Property Damage: $500,000
- Liability: $250,000
- Medical Payments: $25,000
Agent: Robert Johnson
Agency: ABC Insurance
      `.trim()
    }

    return NextResponse.json({ text: mockText })
  } catch (error) {
    console.error("OCR processing error:", error)
    return NextResponse.json({ error: "Failed to process document" }, { status: 500 })
  }
}

