import { useState, useCallback } from 'react';
import { PromptSuggestion, AIResponse } from '@/types/ai';
import toast from 'react-hot-toast';

export const useAISuggestions = () => {
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (params: {
    category: string;
    keywords?: string;
    difficulty?: string;
    targetAudience?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/suggest-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data: AIResponse<PromptSuggestion[]> = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      setSuggestions(data.data || []);
      return data.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    generateSuggestions,
    clearSuggestions,
  };
};
