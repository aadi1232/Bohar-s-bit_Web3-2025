import OpenAI from 'openai';

// Check for OpenAI API key in environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('Warning: OPENAI_API_KEY not found in environment variables. AI features will be disabled.');
}

// Only create OpenAI instance if API key is available
export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null;

export const AI_CONFIG = {
  model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'), // Increased default to 1000
  temperature: 0.7,
  enabled: !!apiKey,
} as const;

// Helper function to check if AI is available
export const isAIEnabled = () => {
  return AI_CONFIG.enabled && openai !== null;
};
