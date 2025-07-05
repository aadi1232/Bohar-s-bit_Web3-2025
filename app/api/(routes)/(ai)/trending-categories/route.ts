import { NextRequest, NextResponse } from "next/server";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import { AIResponse, TrendingCategory } from "@/types/ai";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const prompt = `
    As an AI marketplace expert, provide insights on the top 5 trending prompt categories in the current market.
    
    For each category, provide:
    1. Category name (ChatGPT, Midjourney, DALL-E, Bard, etc.)
    2. Demand score (1-100)
    3. 3-5 suggested prompt ideas that are currently in high demand
    4. Average market price in ETH (0.001-0.1 range)
    
    Consider current trends in:
    - AI content creation
    - Business automation
    - Creative writing
    - Image generation
    - Productivity tools
    - Educational content
    
    Return as JSON array:
    [
      {
        "category": "ChatGPT",
        "demandScore": 85,
        "suggestedPrompts": ["Business email templates", "Creative writing assistant", ...],
        "averagePrice": 0.025
      },
      ...
    ]
    `;

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let trendingCategories: TrendingCategory[];
    try {
      trendingCategories = JSON.parse(aiResponse);
      if (!Array.isArray(trendingCategories)) {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      // Fallback trending categories
      trendingCategories = [
        {
          category: "ChatGPT",
          demandScore: 85,
          suggestedPrompts: ["Business emails", "Content creation", "Code generation"],
          averagePrice: 0.025
        },
        {
          category: "Midjourney",
          demandScore: 80,
          suggestedPrompts: ["Logo design", "Character art", "Concept art"],
          averagePrice: 0.03
        },
        {
          category: "DALL-E",
          demandScore: 75,
          suggestedPrompts: ["Product mockups", "Social media graphics", "Illustrations"],
          averagePrice: 0.02
        },
        {
          category: "Bard",
          demandScore: 70,
          suggestedPrompts: ["Research summaries", "Creative writing", "Data analysis"],
          averagePrice: 0.02
        }
      ];
    }

    const response: AIResponse<TrendingCategory[]> = {
      success: true,
      data: trendingCategories,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI trending categories error:", error);
    
    const errorResponse: AIResponse<TrendingCategory[]> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get trending categories",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
