import { useState, useCallback } from 'react';
import { aiPromptService } from '@/lib/ai/promptService';
import {
  AIPromptSuggestion,
  AIEnhancementResult,
  AIAnalysisScore,
  PromptGenerationParams,
  EnhancementParams,
  AnalysisParams
} from '@/lib/ai/types';
import toast from 'react-hot-toast';

export const useAIPromptService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate prompt suggestions
  const generateSuggestions = useCallback(async (params: PromptGenerationParams): Promise<AIPromptSuggestion[]> => {
    setIsLoading(true);
    setError(null);

    try {
      toast.loading('Generating AI suggestions...', { id: 'suggestions' });
      const suggestions = await aiPromptService.generatePromptSuggestions(params);
      toast.success(`Generated ${suggestions.length} suggestions!`, { id: 'suggestions' });
      return suggestions;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate suggestions';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'suggestions' });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enhance existing prompt
  const enhancePrompt = useCallback(async (params: EnhancementParams): Promise<AIEnhancementResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      toast.loading('Enhancing your prompt...', { id: 'enhance' });
      const result = await aiPromptService.enhancePrompt(params);
      toast.success('Prompt enhanced successfully!', { id: 'enhance' });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to enhance prompt';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'enhance' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze prompt quality
  const analyzePrompt = useCallback(async (params: AnalysisParams): Promise<AIAnalysisScore | null> => {
    setIsLoading(true);
    setError(null);

    try {
      toast.loading('Analyzing prompt quality...', { id: 'analyze' });
      const result = await aiPromptService.analyzePrompt(params);
      toast.success('Analysis completed!', { id: 'analyze' });
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to analyze prompt';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'analyze' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get trending data
  const getTrendingData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await aiPromptService.getTrendingData();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch trending data';
      setError(errorMessage);
      return {
        categories: [],
        keywords: [],
        priceRanges: []
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,

    // Functions
    generateSuggestions,
    enhancePrompt,
    analyzePrompt,
    getTrendingData,
    clearError,
  };
};
