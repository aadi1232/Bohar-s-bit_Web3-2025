export interface PromptSuggestion {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'Chatgpt' | 'Dalle' | 'Midjourney' | 'Bard';
  tags: string[];
  estimatedPrice: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  marketDemand: 'Low' | 'Medium' | 'High';
}

export interface PromptEnhancement {
  originalPrompt: string;
  enhancedPrompt: string;
  improvements: string[];
  suggestedTags: string[];
  suggestedPrice: number;
  marketingTips: string[];
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PromptAnalysis {
  qualityScore: number;
  marketPotential: number;
  suggestions: string[];
  competitorAnalysis: {
    similarPrompts: number;
    avgPrice: number;
    recommendedPrice: number;
  };
}

export interface TrendingCategory {
  category: string;
  demandScore: number;
  suggestedPrompts: string[];
  averagePrice: number;
}
