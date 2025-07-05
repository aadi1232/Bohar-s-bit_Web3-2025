import { openai, AI_CONFIG } from "./openai";
import { PromptSuggestion, PromptEnhancement, PromptAnalysis, TrendingCategory } from "@/types/ai";

export class PromptSuggestionService {
  /**
   * Generate prompt ideas based on market trends
   */
  static async generateTrendingPrompts(category: string): Promise<PromptSuggestion[]> {
    const prompt = `
    Generate 5 trending prompt ideas for ${category} that are currently in high demand in the AI marketplace.
    Focus on:
    - Current market trends
    - Popular use cases
    - Emerging technologies
    - User pain points

    Return as JSON array with: title, description, content, tags, estimatedPrice, difficulty, marketDemand
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating trending prompts:", error);
      return [];
    }
  }

  /**
   * Enhance an existing prompt for better performance
   */
  static async enhancePrompt(originalPrompt: string, category: string): Promise<PromptEnhancement> {
    const prompt = `
    Analyze and enhance this ${category} prompt for better market performance:
    
    Original: "${originalPrompt}"
    
    Provide:
    1. Enhanced version with better structure and clarity
    2. List of specific improvements made
    3. Suggested tags for better discoverability
    4. Recommended price in ETH (0.001-0.1 range)
    5. Marketing tips for better sales

    Return as JSON object.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.6,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      return {
        originalPrompt,
        enhancedPrompt: originalPrompt,
        improvements: ["Unable to generate improvements"],
        suggestedTags: ["ai", "prompt"],
        suggestedPrice: 0.01,
        marketingTips: ["Unable to generate marketing tips"]
      };
    }
  }

  /**
   * Analyze prompt quality and market potential
   */
  static async analyzePrompt(promptContent: string, category: string): Promise<PromptAnalysis> {
    const prompt = `
    Analyze this ${category} prompt for quality and market potential:
    
    "${promptContent}"
    
    Provide:
    1. Quality score (0-100)
    2. Market potential score (0-100)
    3. Specific improvement suggestions
    4. Competitor analysis with similar prompt count and pricing
    5. Recommended selling price in ETH

    Return as JSON object.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.4,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error analyzing prompt:", error);
      return {
        qualityScore: 70,
        marketPotential: 60,
        suggestions: ["Unable to analyze prompt"],
        competitorAnalysis: {
          similarPrompts: 0,
          avgPrice: 0.01,
          recommendedPrice: 0.01
        }
      };
    }
  }

  /**
   * Generate relevant tags for a prompt
   */
  static async generateTags(promptContent: string, category: string): Promise<string[]> {
    const prompt = `
    Generate 8-10 relevant, searchable tags for this ${category} prompt:
    
    "${promptContent}"
    
    Tags should be:
    - SEO-friendly
    - Commonly searched
    - Relevant to the content
    - Mix of broad and specific terms

    Return as JSON array of strings.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.5,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating tags:", error);
      return [category.toLowerCase(), "ai", "prompt", "creative"];
    }
  }

  /**
   * Generate category-specific prompt ideas
   */
  static async generateCategoryPrompts(category: string, count: number = 5): Promise<PromptSuggestion[]> {
    const prompt = `
    Generate ${count} unique and marketable ${category} prompt ideas that are currently trending.
    
    Focus on:
    - High commercial value
    - Current market demands
    - User pain points solutions
    - Emerging trends in ${category}
    
    For each prompt provide:
    - Creative title (max 60 chars)
    - Brief description (max 120 chars)
    - Full prompt content
    - Relevant tags
    - Estimated price in ETH
    - Difficulty level
    - Market demand level
    
    Return as JSON array.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.8,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating category prompts:", error);
      return [];
    }
  }

  /**
   * Get personalized prompt suggestions based on user history
   */
  static async getPersonalizedSuggestions(
    userInterests: string[], 
    previousPurchases: string[] = []
  ): Promise<PromptSuggestion[]> {
    const prompt = `
    Generate 5 personalized prompt suggestions based on user profile:
    
    User Interests: ${userInterests.join(', ')}
    Previous Purchases: ${previousPurchases.join(', ') || 'None'}
    
    Create prompts that:
    - Match user interests
    - Complement previous purchases
    - Offer progression in complexity
    - Provide value for their use cases
    
    Return as JSON array with full prompt details.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error generating personalized suggestions:", error);
      return [];
    }
  }

  /**
   * Optimize prompt for specific use case
   */
  static async optimizeForUseCase(
    promptContent: string, 
    useCase: string, 
    targetAudience: string
  ): Promise<string> {
    const prompt = `
    Optimize this prompt for the specific use case and target audience:
    
    Original Prompt: "${promptContent}"
    Use Case: ${useCase}
    Target Audience: ${targetAudience}
    
    Optimization goals:
    - Maximum effectiveness for the use case
    - Appropriate for target audience
    - Clear and actionable instructions
    - Better results and user satisfaction
    
    Return only the optimized prompt content.
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || promptContent;
    } catch (error) {
      console.error("Error optimizing prompt:", error);
      return promptContent;
    }
  }

  /**
   * Generate market insights for a category
   */
  static async getMarketInsights(category: string): Promise<{
    demand: number;
    competition: number;
    trends: string[];
    opportunities: string[];
  }> {
    const prompt = `
    Provide market insights for ${category} prompts:
    
    Analyze:
    1. Current demand level (0-100)
    2. Competition intensity (0-100)
    3. Top 5 trending topics/themes
    4. Market opportunities and gaps
    
    Return as JSON:
    {
      "demand": 85,
      "competition": 60,
      "trends": ["trend1", "trend2", ...],
      "opportunities": ["opportunity1", "opportunity2", ...]
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.6,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) throw new Error("No AI response");

      return JSON.parse(response);
    } catch (error) {
      console.error("Error getting market insights:", error);
      return {
        demand: 70,
        competition: 50,
        trends: ["General AI applications"],
        opportunities: ["Niche specialization"]
      };
    }
  }
}
