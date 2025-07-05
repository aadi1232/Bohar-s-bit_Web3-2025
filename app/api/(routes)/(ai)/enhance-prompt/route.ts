import { NextRequest, NextResponse } from "next/server";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import { AIResponse, PromptEnhancement } from "@/types/ai";
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

    const { originalPrompt, category, targetAudience } = await req.json();

    if (!originalPrompt || !category) {
      return NextResponse.json(
        { success: false, error: "Original prompt and category are required" },
        { status: 400 }
      );
    }

    const prompt = `
    As an AI prompt optimization expert, enhance this ${category} prompt for better market performance and user engagement.

    Original Prompt: "${originalPrompt}"
    Category: ${category}
    Target Audience: ${targetAudience || 'general users'}

    Please provide:
    1. An enhanced version with better structure, clarity, and effectiveness
    2. List of specific improvements made (be detailed)
    3. 8-10 relevant tags for better discoverability
    4. Recommended price in ETH (0.001-0.1 range) based on complexity and market value
    5. 5 marketing tips to increase sales potential

    Format as JSON:
    {
      "enhancedPrompt": "improved version here",
      "improvements": ["improvement 1", "improvement 2", ...],
      "suggestedTags": ["tag1", "tag2", ...],
      "suggestedPrice": 0.05,
      "marketingTips": ["tip 1", "tip 2", ...]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: 0.6,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let enhancement: PromptEnhancement;
    try {
      const parsed = JSON.parse(aiResponse);
      enhancement = {
        originalPrompt,
        enhancedPrompt: parsed.enhancedPrompt,
        improvements: parsed.improvements || [],
        suggestedTags: parsed.suggestedTags || [],
        suggestedPrice: parsed.suggestedPrice || 0.01,
        marketingTips: parsed.marketingTips || []
      };
    } catch (parseError) {
      // Fallback response
      enhancement = {
        originalPrompt,
        enhancedPrompt: aiResponse.substring(0, 300),
        improvements: ["Enhanced clarity and structure", "Improved user engagement"],
        suggestedTags: [category.toLowerCase(), "ai", "enhanced", "optimized"],
        suggestedPrice: 0.01,
        marketingTips: ["Highlight unique features", "Use clear descriptions"]
      };
    }

    const response: AIResponse<PromptEnhancement> = {
      success: true,
      data: enhancement,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI enhancement error:", error);
    
    const errorResponse: AIResponse<PromptEnhancement> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enhance prompt",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
