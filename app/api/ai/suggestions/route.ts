import { NextRequest, NextResponse } from "next/server";
import { AIPromptSuggestion, PromptGenerationParams } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const params: PromptGenerationParams = await request.json();
    
    // Always provide fallback suggestions to ensure the feature works
    console.log('Generating suggestions for:', params);
    
    let suggestions: AIPromptSuggestion[];
    
    if (process.env.OPENAI_API_KEY) {
      try {
        // Try OpenAI API first
        const systemPrompt = `You are an expert AI prompt engineer and marketplace analyst. Generate creative, high-quality AI prompt suggestions for the ${params.category} category. 
        
        Consider:
        - Current market trends and demand
        - User engagement potential
        - Commercial viability
        - Technical quality
        - Unique value proposition
        
        Return 3-5 diverse suggestions with varying difficulty levels and market potential.
        
        Format your response as a JSON array with the following structure for each suggestion:
        {
          "title": "Catchy, marketable title",
          "description": "Clear description explaining the prompt's purpose and value",
          "prompt": "The actual prompt text (well-structured and effective)",
          "tags": ["relevant", "tags", "array"],
          "difficulty": "Beginner|Intermediate|Advanced",
          "marketPotential": 1-10,
          "estimatedPrice": "0.05",
          "reasoning": "Brief reasoning for market potential"
        }`;

        const userPrompt = `Generate AI prompt suggestions for:
        Category: ${params.category}
        Style: ${params.style || 'Any'}
        Difficulty: ${params.difficulty || 'Any'}
        Keywords: ${params.keywords?.join(', ') || 'None specified'}
        Market Trends Focus: ${params.marketTrends ? 'Yes' : 'No'}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 4000,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0]?.message?.content || '';
          
          try {
            const parsedSuggestions = JSON.parse(aiResponse);
            suggestions = parsedSuggestions.map((s: any, index: number) => ({
              id: Math.random().toString(36).substr(2, 9),
              title: s.title || `${params.category} Prompt ${index + 1}`,
              description: s.description || `High-quality ${params.category} prompt`,
              prompt: s.prompt || `Create a detailed ${params.category} prompt...`,
              category: params.category,
              tags: s.tags || [params.category.toLowerCase()],
              difficulty: s.difficulty || 'Intermediate',
              marketPotential: s.marketPotential || 7,
              estimatedPrice: s.estimatedPrice || '0.05',
              reasoning: s.reasoning || 'Good market potential'
            }));
          } catch (parseError) {
            console.log('Failed to parse OpenAI response, using fallback');
            suggestions = generateFallbackSuggestions(params.category);
          }
        } else {
          console.log('OpenAI API failed, using fallback');
          suggestions = generateFallbackSuggestions(params.category);
        }
      } catch (apiError) {
        console.log('OpenAI API error, using fallback:', apiError);
        suggestions = generateFallbackSuggestions(params.category);
      }
    } else {
      console.log('No OpenAI API key, using fallback suggestions');
      suggestions = generateFallbackSuggestions(params.category);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}

function generateFallbackSuggestions(category: string): AIPromptSuggestion[] {
  const categoryTemplates: { [key: string]: any[] } = {
    'Digital Art': [
      {
        title: 'Professional Digital Art Creator',
        description: 'Generate stunning digital artwork with professional quality and artistic flair.',
        prompt: 'Create a highly detailed digital artwork featuring [subject]. Use professional lighting, vibrant colors, and masterful composition. Style should be [artistic style, e.g., photorealistic, impressionist, cyberpunk]. Pay attention to textures, shadows, and depth. Resolution should be suitable for professional use.',
        tags: ['digital-art', 'professional', 'detailed', 'creative'],
        difficulty: 'Intermediate',
        marketPotential: 9,
        estimatedPrice: '0.06',
        reasoning: 'High demand for professional digital art in creative industries'
      },
      {
        title: 'Fantasy Character Designer',
        description: 'Create captivating fantasy characters with rich backstories and unique designs.',
        prompt: 'Design a fantasy character with the following traits: [character description]. Include detailed clothing, accessories, and magical elements. The character should have a compelling backstory reflected in their appearance. Art style: [style preference]. Focus on originality and emotional expression.',
        tags: ['fantasy', 'character-design', 'creative', 'storytelling'],
        difficulty: 'Advanced',
        marketPotential: 8,
        estimatedPrice: '0.08',
        reasoning: 'Popular in gaming and entertainment industries'
      }
    ],
    'Content Writing': [
      {
        title: 'Engaging Blog Post Generator',
        description: 'Create compelling blog posts that captivate readers and drive engagement.',
        prompt: 'Write an engaging blog post about [topic]. Target audience: [audience]. Tone: [tone, e.g., professional, casual, humorous]. Include: compelling headline, engaging introduction, well-structured body with subheadings, actionable insights, and strong conclusion with call-to-action. Word count: [desired length].',
        tags: ['blog-writing', 'content-creation', 'seo', 'engagement'],
        difficulty: 'Beginner',
        marketPotential: 8,
        estimatedPrice: '0.04',
        reasoning: 'Essential for content marketing and business growth'
      },
      {
        title: 'Social Media Content Creator',
        description: 'Generate viral-worthy social media content that resonates with your audience.',
        prompt: 'Create social media content for [platform] about [topic]. Target audience: [demographics]. Include: attention-grabbing hook, valuable content, relevant hashtags, and clear call-to-action. Format: [post type, e.g., carousel, video script, story]. Optimize for engagement and shareability.',
        tags: ['social-media', 'viral-content', 'marketing', 'engagement'],
        difficulty: 'Intermediate',
        marketPotential: 9,
        estimatedPrice: '0.05',
        reasoning: 'High demand for social media content across all industries'
      }
    ],
    'Code Generation': [
      {
        title: 'Full-Stack Application Builder',
        description: 'Generate complete, production-ready applications with modern best practices.',
        prompt: 'Create a [type of application] using [technology stack]. Requirements: [specific features]. Include: proper project structure, clean code with comments, error handling, security measures, responsive design, and deployment instructions. Follow best practices for [specific framework/language].',
        tags: ['full-stack', 'web-development', 'professional', 'production-ready'],
        difficulty: 'Advanced',
        marketPotential: 10,
        estimatedPrice: '0.12',
        reasoning: 'Extremely valuable for developers and businesses'
      },
      {
        title: 'API Integration Specialist',
        description: 'Create seamless API integrations with proper error handling and optimization.',
        prompt: 'Develop API integration for [service/platform] using [programming language]. Include: authentication handling, rate limiting, error handling, data validation, caching strategies, and comprehensive documentation. Ensure scalability and maintainability.',
        tags: ['api-integration', 'backend', 'scalable', 'documentation'],
        difficulty: 'Intermediate',
        marketPotential: 9,
        estimatedPrice: '0.08',
        reasoning: 'Critical for modern application development'
      }
    ],
    'Marketing': [
      {
        title: 'Conversion-Focused Copy Creator',
        description: 'Write persuasive marketing copy that converts visitors into customers.',
        prompt: 'Create high-converting marketing copy for [product/service]. Target audience: [demographics]. Include: compelling headlines, benefit-focused descriptions, social proof elements, urgency triggers, and strong call-to-action. Format: [landing page, email, ad copy]. Focus on addressing pain points and desired outcomes.',
        tags: ['copywriting', 'conversion', 'marketing', 'sales'],
        difficulty: 'Intermediate',
        marketPotential: 9,
        estimatedPrice: '0.07',
        reasoning: 'Direct impact on business revenue and growth'
      }
    ]
  };

  const templates = categoryTemplates[category] || [
    {
      title: `Professional ${category} Creator`,
      description: `Generate high-quality ${category.toLowerCase()} content with professional standards and attention to detail.`,
      prompt: `Create professional ${category.toLowerCase()} content that meets high-quality standards. Focus on clarity, creativity, and user engagement. Include specific details and ensure the output is polished and ready for professional use. Consider target audience needs and current market trends.`,
      tags: [category.toLowerCase(), 'professional', 'detailed', 'high-quality'],
      difficulty: 'Intermediate',
      marketPotential: 8,
      estimatedPrice: '0.05',
      reasoning: `Strong demand for professional ${category.toLowerCase()} content with proven market appeal`
    },
    {
      title: `Creative ${category} Generator`,
      description: `Unleash creativity with this innovative ${category.toLowerCase()} prompt designed for unique and engaging results.`,
      prompt: `Generate a highly creative and unique ${category.toLowerCase()} that stands out from typical outputs. Emphasize originality, artistic flair, and innovative approaches. Think outside the box and create something truly memorable and impactful.`,
      tags: [category.toLowerCase(), 'creative', 'unique', 'innovative'],
      difficulty: 'Advanced',
      marketPotential: 9,
      estimatedPrice: '0.08',
      reasoning: `High value for creative professionals seeking unique ${category.toLowerCase()} solutions`
    }
  ];

  return templates.map((template, index) => ({
    id: Math.random().toString(36).substr(2, 9),
    ...template,
    category
  }));
}
