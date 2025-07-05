"use client";
import { styles } from "@/utils/styles";
import { Button, Card, CardBody, Textarea, Chip, Progress } from "@nextui-org/react";
import { useState } from "react";
import { usePromptEnhancement } from "@/hooks/usePromptEnhancement";
import { FiRefreshCw, FiZap, FiTrendingUp, FiTag } from "react-icons/fi";

type Props = {
  originalPrompt?: string;
  category: string;
  onEnhancementResult?: (enhancedPrompt: string, tags: string[], price: number) => void;
};

const PromptEnhancer = ({ originalPrompt = "", category, onEnhancementResult }: Props) => {
  const [prompt, setPrompt] = useState(originalPrompt);
  const [targetAudience, setTargetAudience] = useState("");
  
  const { 
    enhancement, 
    analysis, 
    tags, 
    loading, 
    enhancePrompt, 
    analyzePrompt, 
    generateTags 
  } = usePromptEnhancement();

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    
    const result = await enhancePrompt({
      originalPrompt: prompt,
      category,
      targetAudience: targetAudience.trim() || undefined,
    });
    
    if (result && onEnhancementResult) {
      onEnhancementResult(
        result.enhancedPrompt,
        result.suggestedTags,
        result.suggestedPrice
      );
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    await analyzePrompt({
      promptContent: prompt,
      category,
    });
  };

  const handleGenerateTags = async () => {
    if (!prompt.trim()) return;
    
    await generateTags({
      promptContent: prompt,
      category,
    });
  };

  const useEnhancedPrompt = () => {
    if (enhancement) {
      setPrompt(enhancement.enhancedPrompt);
    }
  };

  return (
    <Card className="w-full bg-[#1a1a2e] border border-[#16213e]">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiZap className="text-[#835DED] text-xl" />
          <h3 className={`${styles.heading} !text-xl`}>
            AI Prompt Enhancer
          </h3>
        </div>

        <div className="space-y-4">
          <Textarea
            label="Your Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt to enhance..."
            variant="bordered"
            minRows={4}
            maxRows={8}
          />

          <Textarea
            label="Target Audience (optional)"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., content creators, business professionals, students"
            variant="bordered"
            minRows={2}
          />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleEnhance}
              disabled={loading || !prompt.trim()}
              className="bg-[#835DED] text-white hover:bg-[#6b47d1]"
              startContent={loading ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
            >
              {loading ? 'Enhancing...' : 'Enhance Prompt'}
            </Button>
            
            <Button
              onClick={handleAnalyze}
              disabled={loading || !prompt.trim()}
              variant="flat"
              className="bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
              startContent={<FiTrendingUp />}
            >
              Analyze Quality
            </Button>
            
            <Button
              onClick={handleGenerateTags}
              disabled={loading || !prompt.trim()}
              variant="flat"
              className="bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
              startContent={<FiTag />}
            >
              Generate Tags
            </Button>
          </div>
        </div>

        {/* Enhancement Results */}
        {enhancement && (
          <Card className="mt-6 bg-[#0f0f23] border border-[#2a2a4a]">
            <CardBody className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className={`${styles.label} !text-lg text-[#64ff4b]`}>
                  Enhanced Version
                </h4>
                <Button
                  size="sm"
                  onClick={useEnhancedPrompt}
                  className="bg-[#64ff4b] text-black hover:bg-[#52d93a]"
                >
                  Use Enhanced
                </Button>
              </div>
              
              <div className="bg-[#1a1a2e] p-4 rounded-lg mb-4">
                <p className={`${styles.paragraph} leading-relaxed`}>
                  {enhancement.enhancedPrompt}
                </p>
              </div>

              <div className="mb-4">
                <h5 className={`${styles.label} !text-sm mb-2`}>Improvements Made:</h5>
                <div className="space-y-1">
                  {enhancement.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-[#64ff4b] mt-1">•</span>
                      <span className={`${styles.paragraph} !text-sm`}>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h5 className={`${styles.label} !text-sm mb-2`}>Suggested Tags:</h5>
                <div className="flex flex-wrap gap-2">
                  {enhancement.suggestedTags.map((tag, index) => (
                    <Chip key={index} size="sm" className="bg-[#835DED20] text-[#835DED]">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <span className={`${styles.label} !text-lg text-[#64ff4b]`}>
                    {enhancement.suggestedPrice} ETH
                  </span>
                  <span className={`${styles.paragraph} !text-xs ml-2`}>
                    (suggested price)
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && (
          <Card className="mt-6 bg-[#0f0f23] border border-[#2a2a4a]">
            <CardBody className="p-4">
              <h4 className={`${styles.label} !text-lg text-[#64ff4b] mb-4`}>
                Quality Analysis
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`${styles.label} !text-sm`}>Quality Score</span>
                    <span className={`${styles.label} !text-sm`}>{analysis.qualityScore}/100</span>
                  </div>
                  <Progress 
                    value={analysis.qualityScore} 
                    className="max-w-full"
                    color={analysis.qualityScore >= 80 ? "success" : analysis.qualityScore >= 60 ? "warning" : "danger"}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className={`${styles.label} !text-sm`}>Market Potential</span>
                    <span className={`${styles.label} !text-sm`}>{analysis.marketPotential}/100</span>
                  </div>
                  <Progress 
                    value={analysis.marketPotential} 
                    className="max-w-full"
                    color={analysis.marketPotential >= 80 ? "success" : analysis.marketPotential >= 60 ? "warning" : "danger"}
                  />
                </div>

                <div>
                  <h5 className={`${styles.label} !text-sm mb-2`}>Suggestions for Improvement:</h5>
                  <div className="space-y-1">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-[#835DED] mt-1">•</span>
                        <span className={`${styles.paragraph} !text-sm`}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1a2e] p-3 rounded-lg">
                  <h5 className={`${styles.label} !text-sm mb-2`}>Market Analysis:</h5>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className={`${styles.label} !text-xs text-gray-400`}>Similar Prompts</span>
                      <p className={`${styles.label} !text-lg`}>{analysis.competitorAnalysis.similarPrompts}</p>
                    </div>
                    <div>
                      <span className={`${styles.label} !text-xs text-gray-400`}>Avg Price</span>
                      <p className={`${styles.label} !text-lg`}>{analysis.competitorAnalysis.avgPrice} ETH</p>
                    </div>
                    <div>
                      <span className={`${styles.label} !text-xs text-gray-400`}>Recommended</span>
                      <p className={`${styles.label} !text-lg text-[#64ff4b]`}>{analysis.competitorAnalysis.recommendedPrice} ETH</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Generated Tags */}
        {tags.length > 0 && !enhancement && (
          <Card className="mt-6 bg-[#0f0f23] border border-[#2a2a4a]">
            <CardBody className="p-4">
              <h4 className={`${styles.label} !text-lg text-[#64ff4b] mb-4`}>
                Generated Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Chip key={index} size="sm" className="bg-[#835DED20] text-[#835DED]">
                    {tag}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
};

export default PromptEnhancer;
