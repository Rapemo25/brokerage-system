"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeDocument(text: string) {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI assistant for an insurance brokerage system. 
        Analyze the following document text extracted via OCR and extract key information in JSON format.
        Include fields like policy number, client name, coverage amount, premium, dates, and any other relevant information.
        
        Document text:
        ${text}
      `,
      temperature: 0.2,
    })

    return JSON.parse(result)
  } catch (error) {
    console.error("Error analyzing document:", error)
    throw new Error("Failed to analyze document")
  }
}

export async function generateInsuranceRecommendation(clientInfo: any) {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI assistant for an insurance brokerage system.
        Based on the following client information, provide personalized insurance recommendations.
        Format your response as JSON with fields for recommended policies, coverage amounts, and reasoning.
        
        Client information:
        ${JSON.stringify(clientInfo, null, 2)}
      `,
      temperature: 0.3,
    })

    return JSON.parse(result)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    throw new Error("Failed to generate insurance recommendations")
  }
}

export async function answerInsuranceQuery(query: string) {
  try {
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        You are an AI assistant for an insurance brokerage system.
        Answer the following insurance-related query in a helpful, accurate, and concise manner.
        
        Query: ${query}
      `,
      temperature: 0.3,
    })

    return result
  } catch (error) {
    console.error("Error answering query:", error)
    throw new Error("Failed to answer insurance query")
  }
}

// Replace the generateInsuranceQuote function with this version that doesn't require an API key
// and uses Kenya Shillings

export async function generateInsuranceQuote(type: string, formData: any) {
  try {
    // Instead of calling the OpenAI API, we'll directly generate a mock quote
    // This eliminates the need for an API key in the prototype

    // Calculate premium based on form data (using higher values for KSh)
    const premium =
      type === "motor"
        ? formData.value * 0.05 + formData.previousClaims * 20000
        : formData.buildingValue * 0.01 + formData.inventoryValue * 0.02

    // Apply discounts
    const discount =
      type === "motor" ? formData.driverExperience * 2000 : formData.yearsInBusiness === "20+" ? 50000 : 20000

    // Add costs for additional coverage
    const additionalCoverage =
      type === "motor"
        ? formData.coverageType === "comprehensive"
          ? 30000
          : 0
        : (formData.cyberInsurance ? 50000 : 0) + (formData.professionalLiability ? 80000 : 0)

    // Calculate final premium
    const finalPremium = premium - discount + additionalCoverage

    return {
      premium: finalPremium,
      basePremium: premium,
      discount: discount,
      additionalCoverage: additionalCoverage,
      coverage:
        type === "motor"
          ? {
              type: formData.coverageType,
              vehicleValue: formData.value,
              deductible: 50000,
              liability: 3000000,
              uninsuredMotorist: true,
              roadside: true,
            }
          : {
              property: formData.buildingValue,
              inventory: formData.inventoryValue,
              liability: formData.liabilityCoverage,
              interruption: formData.businessInterruption,
              cyber: formData.cyberInsurance,
              professional: formData.professionalLiability,
            },
      recommendations:
        type === "motor"
          ? ["Consider adding theft protection", "Bundling with home insurance could save 15%"]
          : ["Add cyber insurance for better protection", "Consider increasing liability coverage"],
    }
  } catch (error) {
    console.error("Error generating quote:", error)
    throw new Error("Failed to generate insurance quote")
  }
}

