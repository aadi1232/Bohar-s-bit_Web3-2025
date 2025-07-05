import { NextRequest, NextResponse } from "next/server";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import { AIResponse, PromptAnalysis } from "@/types/ai";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { promptContent, category, title } = await req.json();

    if (!promptContent) {
      return NextResponse.json(
        { success: false, error: "Prompt content is required" },
        { status: 400 }
      );
    }

    const prompt = `
    Analyze this ${category} prompt for market potential and quality:
    
    Title: "${title}"
    Content: "${promptContent}"
    Category: ${category}
    
    Provide analysis in the following areas:
    1. Quality Score (0-100): Rate the prompt's clarity, usefulness, and effectiveness
    2. Market Potential (0-100): Rate commercial viability and demand potential
    3. Improvement Suggestions: Specific actionable recommendations
    4. Competitor Analysis: Estimated market saturation and pricing insights
    5. Recommended Price: Suggested ETH price (0.001-0.1 range)
    
    Consider factors like:
    - Uniqueness and creativity
    - Practical applicability
    - Target audience size
    - Current market trends
    - Technical complexity
    
    Return as JSON:
    {
      "qualityScore": 85,
      "marketPotential": 75,
      "suggestions": ["suggestion 1", "suggestion 2", ...],
      "competitorAnalysis": {
        "similarPrompts": 50,
        "avgPrice": 0.025,
        "recommendedPrice": 0.03
      }
    }
    `;

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: 0.4,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let analysis: PromptAnalysis;
    try {
      const parsed = JSON.parse(aiResponse);
      analysis = {
        qualityScore: parsed.qualityScore || 70,
        marketPotential: parsed.marketPotential || 60,
        suggestions: parsed.suggestions || ["Consider adding more specific use cases"],
        competitorAnalysis: {
          similarPrompts: parsed.competitorAnalysis?.similarPrompts || 25,
          avgPrice: parsed.competitorAnalysis?.avgPrice || 0.02,
          recommendedPrice: parsed.competitorAnalysis?.recommendedPrice || 0.02
        }
      };
    } catch (parseError) {
      // Fallback analysis
      analysis = {
        qualityScore: 70,
        marketPotential: 65,
        suggestions: [
          "Add more specific examples",
          "Include clearer instructions",
          "Consider target audience needs"
        ],
        competitorAnalysis: {
          similarPrompts: 30,
          avgPrice: 0.02,
          recommendedPrice: 0.025
        }
      };
    }

    const response: AIResponse<PromptAnalysis> = {
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI analysis error:", error);
    
    const errorResponse: AIResponse<PromptAnalysis> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze prompt",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
