import { useState, useCallback } from 'react';
import { PromptEnhancement, PromptAnalysis, AIResponse } from '@/types/ai';
import toast from 'react-hot-toast';

export const usePromptEnhancement = () => {
  const [enhancement, setEnhancement] = useState<PromptEnhancement | null>(null);
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhancePrompt = useCallback(async (params: {
    originalPrompt: string;
    category: string;
    targetAudience?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data: AIResponse<PromptEnhancement> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to enhance prompt');
      }

      setEnhancement(data.data || null);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance prompt';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzePrompt = useCallback(async (params: {
    promptContent: string;
    category: string;
    title?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data: AIResponse<PromptAnalysis> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze prompt');
      }

      setAnalysis(data.data || null);
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze prompt';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTags = useCallback(async (params: {
    promptContent: string;
    category: string;
    title?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data: AIResponse<string[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate tags');
      }

      setTags(data.data || []);
      return data.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate tags';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setEnhancement(null);
    setAnalysis(null);
    setTags([]);
    setError(null);
  }, []);

  return {
    enhancement,
    analysis,
    tags,
    loading,
    error,
    enhancePrompt,
    analyzePrompt,
    generateTags,
    clearData,
  };
};
