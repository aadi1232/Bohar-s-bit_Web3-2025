'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { FaRobot, FaLightbulb, FaArrowRight, FaCopy, FaCheck } from 'react-icons/fa';
import { useAIPromptService } from '@/hooks/useAIPromptService';
import { AIPromptSuggestion, PromptGenerationParams } from '@/lib/ai/types';
import toast from 'react-hot-toast';

interface AISuggestionsProps {
  category: string;
  onSelectSuggestion: (suggestion: AIPromptSuggestion) => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ category, onSelectSuggestion }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { generateSuggestions, isLoading } = useAIPromptService();
  const [suggestions, setSuggestions] = useState<AIPromptSuggestion[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    const categoryToUse = category || 'General'; // Use 'General' if no category is selected
    
    const params: PromptGenerationParams = {
      category: categoryToUse,
      marketTrends: true,
      difficulty: 'Intermediate'
    };

    const newSuggestions = await generateSuggestions(params);
    setSuggestions(newSuggestions);
    onOpen();
  };

  const handleCopyPrompt = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedId(id);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'default';
    }
  };

  const getMarketPotentialColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 6) return 'warning';
    return 'danger';
  };

  return (
    <>
      <Button
        onClick={handleGenerateSuggestions}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold hover:shadow-lg transition-all duration-300"
        startContent={<FaRobot className="text-lg" />}
      >
        {isLoading ? 'Generating...' : 'Get AI Suggestions'}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-[#130f23] border border-[#835DED]/30",
          header: "border-b border-[#835DED]/20",
          body: "py-6",
          footer: "border-t border-[#835DED]/20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                    <FaLightbulb className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Prompt Suggestions</h3>
                    <p className="text-gray-400">Choose a suggestion to get started</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-6">
                  {suggestions.map((suggestion) => (
                    <Card 
                      key={suggestion.id} 
                      className="p-6 bg-[#1a0f3a] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 cursor-pointer hover:scale-105"
                      isPressable
                      onPress={() => {
                        onSelectSuggestion(suggestion);
                        onClose();
                      }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">{suggestion.title}</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">{suggestion.description}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <Chip 
                              color={getDifficultyColor(suggestion.difficulty)}
                              variant="flat"
                              size="sm"
                            >
                              {suggestion.difficulty}
                            </Chip>
                            <Chip 
                              color={getMarketPotentialColor(suggestion.marketPotential)}
                              variant="flat"
                              size="sm"
                            >
                              {suggestion.marketPotential}/10 Market
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="space-y-4">
                        {/* Prompt Preview */}
                        <div className="bg-[#0f0826] border border-[#835DED]/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#835DED] font-medium text-sm">Prompt Content</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPrompt(suggestion.prompt, suggestion.id);
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              {copiedId === suggestion.id ? <FaCheck /> : <FaCopy />}
                            </Button>
                          </div>
                          <p className="text-gray-300 text-sm font-mono leading-relaxed line-clamp-3">
                            {suggestion.prompt}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {suggestion.tags.map((tag, index) => (
                            <Chip 
                              key={index}
                              variant="flat"
                              size="sm"
                              className="bg-[#835DED]/10 text-[#835DED]"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>

                        {/* Market Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400">
                              Est. Price: <span className="text-[#FF7E5F] font-semibold">{suggestion.estimatedPrice} ETH</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-[#835DED]">
                            <span>Use This Suggestion</span>
                            <FaArrowRight />
                          </div>
                        </div>

                        {/* Reasoning */}
                        <div className="text-xs text-gray-400 italic">
                          💡 {suggestion.reasoning}
                        </div>
                      </CardBody>
                    </Card>
                  ))}

                  {suggestions.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#835DED]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaRobot className="text-[#835DED] text-2xl" />
                      </div>
                      <p className="text-gray-400 text-lg">No suggestions generated yet</p>
                      <p className="text-gray-500 text-sm">Click "Get AI Suggestions" to generate prompts</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="text-center py-12">
                      <div className="animate-spin w-12 h-12 border-4 border-[#835DED]/20 border-t-[#835DED] rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-400 text-lg">Generating AI suggestions...</p>
                      <p className="text-gray-500 text-sm">This may take a few moments</p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white"
                  onPress={handleGenerateSuggestions}
                  disabled={isLoading}
                >
                  Generate New Suggestions
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
