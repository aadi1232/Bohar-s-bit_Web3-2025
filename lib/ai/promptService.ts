import { 
  AIPromptSuggestion, 
  AIEnhancementResult, 
  AIAnalysisScore,
  PromptGenerationParams,
  EnhancementParams,
  AnalysisParams
} from './types';

class AIPromptService {
  private baseURL: string;

  constructor() {
    this.baseURL = typeof window !== 'undefined' ? window.location.origin : '';
  }

  // Generate AI prompt suggestions based on parameters
  async generatePromptSuggestions(params: PromptGenerationParams): Promise<AIPromptSuggestion[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Error generating prompt suggestions:', error);
      throw new Error('Failed to generate AI prompt suggestions');
    }
  }

  // Enhance an existing prompt
  async enhancePrompt(params: EnhancementParams): Promise<AIEnhancementResult> {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.enhancement;
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      throw new Error('Failed to enhance prompt');
    }
  }

  // Analyze prompt quality and market potential
  async analyzePrompt(params: AnalysisParams): Promise<AIAnalysisScore> {
    try {
      const response = await fetch(`${this.baseURL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      throw new Error('Failed to analyze prompt');
    }
  }

  // Get trending categories and keywords
  async getTrendingData(): Promise<{
    categories: { name: string; growth: number; demand: string }[];
    keywords: { word: string; popularity: number; category: string }[];
    priceRanges: { category: string; min: string; max: string; average: string }[];
  }> {
    try {
      // Since this is static data, we'll return mock data for now
      return this.getFallbackTrendingData();
    } catch (error) {
      console.error('Error fetching trending data:', error);
      return this.getFallbackTrendingData();
    }
  }

  // Private helper methods
  private getFallbackTrendingData() {
    return {
      categories: [
        { name: 'Digital Art', growth: 25, demand: 'Very High' },
        { name: 'Content Writing', growth: 18, demand: 'High' },
        { name: 'Code Generation', growth: 30, demand: 'Very High' },
        { name: 'Marketing Copy', growth: 15, demand: 'High' },
        { name: 'Creative Writing', growth: 12, demand: 'Medium' },
        { name: 'Educational Content', growth: 20, demand: 'High' }
      ],
      keywords: [
        { word: 'professional', popularity: 95, category: 'General' },
        { word: 'creative', popularity: 88, category: 'Art' },
        { word: 'detailed', popularity: 82, category: 'General' },
        { word: 'modern', popularity: 78, category: 'Design' },
        { word: 'engaging', popularity: 85, category: 'Content' },
        { word: 'innovative', popularity: 76, category: 'Technology' }
      ],
      priceRanges: [
        { category: 'Digital Art', min: '0.02', max: '0.15', average: '0.06' },
        { category: 'Content Writing', min: '0.01', max: '0.08', average: '0.04' },
        { category: 'Code Generation', min: '0.03', max: '0.20', average: '0.08' },
        { category: 'Marketing Copy', min: '0.02', max: '0.10', average: '0.05' },
        { category: 'Creative Writing', min: '0.01', max: '0.06', average: '0.03' },
        { category: 'Educational Content', min: '0.02', max: '0.08', average: '0.04' }
      ]
    };
  }
}

export const aiPromptService = new AIPromptService();
