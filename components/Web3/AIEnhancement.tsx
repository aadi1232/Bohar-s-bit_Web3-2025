'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { FaRocket, FaWandMagicSparkles, FaArrowsLeftRight } from 'react-icons/fa6';
import { useAIPromptService } from '@/hooks/useAIPromptService';
import { EnhancementParams, AIEnhancementResult } from '@/lib/ai/types';
import toast from 'react-hot-toast';

interface AIEnhancementProps {
  prompt: string;
  category: string;
  onEnhancement: (enhanced: AIEnhancementResult) => void;
}

export const AIEnhancement: React.FC<AIEnhancementProps> = ({ prompt, category, onEnhancement }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { enhancePrompt, isLoading } = useAIPromptService();
  const [enhancement, setEnhancement] = useState<AIEnhancementResult | null>(null);

  const handleEnhance = async () => {
    const promptToUse = prompt.trim() || 'Create a detailed and engaging prompt for AI generation.'; // Provide default if empty
    const categoryToUse = category || 'General';

    const params: EnhancementParams = {
      prompt: promptToUse,
      category: categoryToUse,
      focusAreas: ['clarity', 'creativity', 'specificity', 'structure']
    };

    const result = await enhancePrompt(params);
    if (result) {
      setEnhancement(result);
      onOpen();
    }
  };

  const handleUseEnhanced = () => {
    if (enhancement) {
      onEnhancement(enhancement);
      onOpenChange();
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <>
      <Button
        onClick={handleEnhance}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#FF7E5F] to-[#835DED] text-white font-semibold hover:shadow-lg transition-all duration-300"
        startContent={<FaWandMagicSparkles className="text-lg" />}
      >
        {isLoading ? 'Enhancing...' : 'Enhance with AI'}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-[#130f23] border border-[#FF7E5F]/30",
          header: "border-b border-[#FF7E5F]/20",
          body: "py-6",
          footer: "border-t border-[#FF7E5F]/20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF7E5F] to-[#835DED] rounded-full flex items-center justify-center">
                    <FaRocket className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Enhancement Results</h3>
                    <p className="text-gray-400">Your prompt has been improved</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {enhancement && (
                  <div className="space-y-6">
                    {/* Quality Score Improvement */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#FF7E5F]/20">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <FaArrowsLeftRight className="text-[#FF7E5F]" />
                          <span>Quality Score Improvement</span>
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-red-400">{enhancement.qualityScore.before}</div>
                            <div className="text-sm text-gray-400">Before</div>
                          </div>
                          <div className="text-[#FF7E5F] text-2xl">→</div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">{enhancement.qualityScore.after}</div>
                            <div className="text-sm text-gray-400">After</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#FF7E5F]">
                              +{enhancement.qualityScore.after - enhancement.qualityScore.before}
                            </div>
                            <div className="text-sm text-gray-400">Improvement</div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Original */}
                      <Card className="p-4 bg-[#1a0f3a] border border-red-400/20">
                        <CardHeader className="pb-3">
                          <h5 className="font-bold text-white">Original Prompt</h5>
                        </CardHeader>
                        <CardBody>
                          <Textarea
                            value={enhancement.originalPrompt}
                            readOnly
                            rows={8}
                            className="font-mono text-sm"
                            classNames={{
                              input: "text-gray-300",
                              inputWrapper: "bg-[#0f0826] border border-red-400/20"
                            }}
                          />
                        </CardBody>
                      </Card>

                      {/* Enhanced */}
                      <Card className="p-4 bg-[#1a0f3a] border border-green-400/20">
                        <CardHeader className="pb-3">
                          <h5 className="font-bold text-white">Enhanced Prompt</h5>
                        </CardHeader>
                        <CardBody>
                          <Textarea
                            value={enhancement.enhancedPrompt}
                            readOnly
                            rows={8}
                            className="font-mono text-sm"
                            classNames={{
                              input: "text-gray-300",
                              inputWrapper: "bg-[#0f0826] border border-green-400/20"
                            }}
                          />
                        </CardBody>
                      </Card>
                    </div>

                    {/* Improvements Made */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#FF7E5F]/20">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white">Improvements Made</h4>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {enhancement.improvements.map((improvement, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-[#0f0826] rounded-lg border border-[#FF7E5F]/10">
                              <div className="w-8 h-8 bg-[#FF7E5F]/20 rounded-full flex items-center justify-center text-[#FF7E5F] font-bold text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-white capitalize">{improvement.type}</span>
                                  <span className={`text-sm font-medium ${getImpactColor(improvement.impact)}`}>
                                    ({improvement.impact} impact)
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm">{improvement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Additional Suggestions */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#835DED]/20">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white">Additional Suggestions</h4>
                      </CardHeader>
                      <CardBody>
                        <ul className="space-y-2">
                          {enhancement.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start space-x-2 text-gray-300">
                              <span className="text-[#835DED] text-sm">•</span>
                              <span className="text-sm">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Keep Original
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#FF7E5F] to-[#835DED] text-white"
                  onPress={handleUseEnhanced}
                >
                  Use Enhanced Version
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
