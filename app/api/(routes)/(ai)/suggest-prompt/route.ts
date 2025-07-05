import { NextRequest, NextResponse } from "next/server";
import { openai, AI_CONFIG, isAIEnabled } from "@/lib/ai/openai";
import { AIResponse, PromptSuggestion } from "@/types/ai";
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

    // Check if AI is enabled
    if (!isAIEnabled() || !openai) {
      return NextResponse.json({
        success: false,
        error: "AI service is currently unavailable. Please check your OpenAI API key configuration.",
      }, { status: 503 });
    }

    const { category, keywords, difficulty, targetAudience } = await req.json();

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category is required" },
        { status: 400 }
      );
    }

    const prompt = `
    As an AI prompt marketplace expert, generate 3 unique and marketable prompt ideas for the ${category} category.

    Requirements:
    - Category: ${category}
    - Keywords: ${keywords || 'general'}
    - Difficulty: ${difficulty || 'Intermediate'}
    - Target Audience: ${targetAudience || 'general users'}

    For each prompt, provide:
    1. A catchy title (max 60 characters)
    2. A brief description (max 120 characters)
    3. The actual prompt content
    4. Relevant tags (5-8 tags)
    5. Estimated price in ETH (0.001 to 0.1 range)
    6. Market demand level (Low/Medium/High)

    Respond in JSON format with an array of prompt objects.
    `;

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse AI response and format as PromptSuggestion[]
    let suggestions: PromptSuggestion[];
    try {
      const parsed = JSON.parse(aiResponse);
      suggestions = Array.isArray(parsed) ? parsed : parsed.suggestions || [];
    } catch (parseError) {
      // Fallback: create a structured response
      suggestions = [{
        id: `suggestion-${Date.now()}`,
        title: `${category} Prompt Idea`,
        description: "AI-generated prompt suggestion",
        content: aiResponse.substring(0, 200),
        category: category as any,
        tags: keywords ? keywords.split(',').map((k: string) => k.trim()) : ['ai', 'creative'],
        estimatedPrice: 0.01,
        difficulty: difficulty || 'Intermediate',
        marketDemand: 'Medium'
      }];
    }

    const response: AIResponse<PromptSuggestion[]> = {
      success: true,
      data: suggestions,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI suggestion error:", error);
    
    const errorResponse: AIResponse<PromptSuggestion[]> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate suggestions",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
