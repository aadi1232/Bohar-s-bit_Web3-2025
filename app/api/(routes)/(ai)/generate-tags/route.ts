import { NextRequest, NextResponse } from "next/server";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import { AIResponse } from "@/types/ai";
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
    Generate 10-12 relevant, searchable tags for this ${category || 'AI'} prompt:
    
    Title: "${title || 'Untitled'}"
    Content: "${promptContent}"
    Category: ${category || 'General'}
    
    Requirements for tags:
    - SEO-friendly and commonly searched
    - Mix of broad and specific terms
    - Include trending keywords in AI/prompt space
    - Relevant to the actual content
    - Good for marketplace discoverability
    - Include category-specific terms
    
    Return only a JSON array of strings, no other text:
    ["tag1", "tag2", "tag3", ...]
    `;

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let tags: string[];
    try {
      tags = JSON.parse(aiResponse);
      if (!Array.isArray(tags)) {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      // Fallback tags based on category and content
      const fallbackTags = [
        category?.toLowerCase() || 'ai',
        'prompt',
        'creative',
        'digital',
        'automation',
        'productivity',
        'innovation',
        'technology'
      ];
      tags = fallbackTags;
    }

    const response: AIResponse<string[]> = {
      success: true,
      data: tags,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI tag generation error:", error);
    
    const errorResponse: AIResponse<string[]> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate tags",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
