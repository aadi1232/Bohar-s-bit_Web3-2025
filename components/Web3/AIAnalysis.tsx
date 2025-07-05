'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Progress, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { FaChartLine, FaSearch, FaStar, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAIPromptService } from '@/hooks/useAIPromptService';
import { AnalysisParams, AIAnalysisScore } from '@/lib/ai/types';
import toast from 'react-hot-toast';

interface AIAnalysisProps {
  prompt: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  onAnalysisComplete: (analysis: AIAnalysisScore) => void;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  prompt, 
  title, 
  description, 
  category, 
  tags, 
  onAnalysisComplete 
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { analyzePrompt, isLoading } = useAIPromptService();
  const [analysis, setAnalysis] = useState<AIAnalysisScore | null>(null);

  const handleAnalyze = async () => {
    const promptToUse = prompt.trim() || 'Sample AI prompt for analysis';
    const titleToUse = title.trim() || 'AI Prompt Analysis';
    const descriptionToUse = description.trim() || 'AI prompt for quality analysis';
    const categoryToUse = category || 'General';

    const params: AnalysisParams = {
      prompt: promptToUse,
      title: titleToUse,
      description: descriptionToUse,
      category: categoryToUse,
      tags: tags.filter(tag => tag.trim()).length > 0 ? tags.filter(tag => tag.trim()) : ['ai', 'prompt']
    };

    const result = await analyzePrompt(params);
    if (result) {
      setAnalysis(result);
      onAnalysisComplete(result);
      onOpen();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'primary';
      default: return 'default';
    }
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <>
      <Button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#835DED] to-[#6366f1] text-white font-semibold hover:shadow-lg transition-all duration-300"
        startContent={<FaChartLine className="text-lg" />}
      >
        {isLoading ? 'Analyzing...' : 'AI Quality Analysis'}
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
              <ModalHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#6366f1] rounded-full flex items-center justify-center">
                    <FaSearch className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Quality Analysis</h3>
                    <p className="text-gray-400">Comprehensive prompt evaluation</p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody>
                {analysis && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#835DED]/20">
                      <CardBody>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-white">Overall Quality Score</h4>
                          <div className="text-right">
                            <div className="text-4xl font-bold text-[#835DED]">{analysis.overallScore}</div>
                            <div className="text-lg font-semibold text-gray-300">Grade: {getScoreGrade(analysis.overallScore)}</div>
                          </div>
                        </div>
                        <Progress 
                          value={analysis.overallScore} 
                          color={getScoreColor(analysis.overallScore)}
                          className="mb-2"
                        />
                        <div className="text-sm text-gray-400">
                          Ranking: {analysis.marketComparison.ranking} in {analysis.marketComparison.category}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Score Breakdown */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#835DED]/20">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white">Detailed Breakdown</h4>
                      </CardHeader>
                      <CardBody className="space-y-4">
                        {Object.entries(analysis.breakdown).map(([key, score]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white capitalize font-medium">{key}</span>
                              <span className="text-[#835DED] font-bold">{score}/100</span>
                            </div>
                            <Progress 
                              value={score} 
                              color={getScoreColor(score)}
                              size="sm"
                            />
                          </div>
                        ))}
                      </CardBody>
                    </Card>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <Card className="p-6 bg-[#1a0f3a] border border-green-400/20">
                        <CardHeader className="pb-4">
                          <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                            <FaCheckCircle className="text-green-400" />
                            <span>Strengths</span>
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <ul className="space-y-2">
                            {analysis.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-400 text-sm">✓</span>
                                <span className="text-gray-300 text-sm">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardBody>
                      </Card>

                      {/* Weaknesses */}
                      <Card className="p-6 bg-[#1a0f3a] border border-red-400/20">
                        <CardHeader className="pb-4">
                          <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                            <FaExclamationTriangle className="text-red-400" />
                            <span>Areas for Improvement</span>
                          </h4>
                        </CardHeader>
                        <CardBody>
                          <ul className="space-y-2">
                            {analysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-red-400 text-sm">!</span>
                                <span className="text-gray-300 text-sm">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </CardBody>
                      </Card>
                    </div>

                    {/* Recommendations */}
                    <Card className="p-6 bg-[#1a0f3a] border border-[#835DED]/20">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white">Improvement Recommendations</h4>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          {analysis.recommendations.map((rec, index) => (
                            <div key={index} className="p-4 bg-[#0f0826] rounded-lg border border-[#835DED]/10">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Chip 
                                    color={getPriorityColor(rec.priority)}
                                    size="sm"
                                    variant="flat"
                                  >
                                    {rec.priority} priority
                                  </Chip>
                                </div>
                              </div>
                              <h6 className="font-semibold text-white mb-1">{rec.suggestion}</h6>
                              <p className="text-gray-400 text-sm">{rec.impact}</p>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Price Recommendation */}
                    <Card className="p-6 bg-gradient-to-r from-[#835DED]/10 to-[#6366f1]/10 border border-[#835DED]/30">
                      <CardHeader className="pb-4">
                        <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                          <FaStar className="text-yellow-400" />
                          <span>Pricing Recommendation</span>
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Minimum</div>
                            <div className="text-xl font-bold text-[#835DED]">{analysis.priceRecommendation.min} ETH</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Optimal</div>
                            <div className="text-2xl font-bold text-green-400">{analysis.priceRecommendation.optimal} ETH</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Maximum</div>
                            <div className="text-xl font-bold text-[#835DED]">{analysis.priceRecommendation.max} ETH</div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{analysis.priceRecommendation.reasoning}</p>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
                  Close Analysis
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#835DED] to-[#6366f1] text-white"
                  onPress={handleAnalyze}
                  disabled={isLoading}
                >
                  Re-analyze
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
