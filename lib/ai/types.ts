// AI Service Types
export interface AIPromptSuggestion {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  marketPotential: number; // 1-10 score
  estimatedPrice: string; // in ETH
  reasoning: string;
}

export interface AIEnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  improvements: {
    type: 'clarity' | 'specificity' | 'creativity' | 'structure' | 'keywords';
    description: string;
    impact: 'low' | 'medium' | 'high';
  }[];
  qualityScore: {
    before: number;
    after: number;
  };
  suggestions: string[];
}

export interface AIAnalysisScore {
  overallScore: number; // 1-100
  breakdown: {
    clarity: number;
    creativity: number;
    marketability: number;
    uniqueness: number;
    effectiveness: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    impact: string;
  }[];
  marketComparison: {
    category: string;
    averageScore: number;
    ranking: string; // "Top 10%", "Above Average", etc.
  };
  priceRecommendation: {
    min: string;
    max: string;
    optimal: string;
    reasoning: string;
  };
}

export interface PromptGenerationParams {
  category: string;
  style?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  keywords?: string[];
  marketTrends?: boolean;
  userId?: string;
}

export interface EnhancementParams {
  prompt: string;
  category: string;
  targetAudience?: string;
  focusAreas?: ('clarity' | 'creativity' | 'specificity' | 'structure')[];
}

export interface AnalysisParams {
  prompt: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}
