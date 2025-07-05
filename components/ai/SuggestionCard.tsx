"use client";
import { styles } from "@/utils/styles";
import { Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import { PromptSuggestion } from "@/types/ai";
import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

type Props = {
  suggestion: PromptSuggestion;
  onUse?: (suggestion: PromptSuggestion) => void;
};

const SuggestionCard = ({ suggestion, onUse }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestion.content);
      setCopied(true);
      toast.success("Prompt copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy prompt");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card className="w-full bg-[#1a1a2e] border border-[#16213e] hover:border-[#835DED] transition-all duration-300">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start mb-2">
            <h4 className={`${styles.label} !text-lg text-white font-medium`}>
              {suggestion.title}
            </h4>
            <div className="flex gap-2">
              <Chip size="sm" color={getDifficultyColor(suggestion.difficulty)}>
                {suggestion.difficulty}
              </Chip>
              <Chip size="sm" color={getDemandColor(suggestion.marketDemand)}>
                {suggestion.marketDemand}
              </Chip>
            </div>
          </div>
          <p className={`${styles.paragraph} !text-sm`}>
            {suggestion.description}
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="mb-4">
          <div className="bg-[#0f0f23] p-3 rounded-lg border border-[#2a2a4a]">
            <p className={`${styles.paragraph} !text-sm leading-relaxed`}>
              {suggestion.content}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className={`${styles.label} !text-sm mb-2`}>Tags:</p>
          <div className="flex flex-wrap gap-2">
            {suggestion.tags.map((tag, index) => (
              <Chip key={index} size="sm" variant="flat" className="bg-[#835DED20] text-[#835DED]">
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`${styles.label} !text-lg text-[#64ff4b]`}>
              {suggestion.estimatedPrice} ETH
            </span>
            <span className={`${styles.paragraph} !text-xs`}>
              (suggested price)
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              className="bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
              startContent={copied ? <FiCheck /> : <FiCopy />}
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            {onUse && (
              <Button
                size="sm"
                className="bg-[#835DED] text-white hover:bg-[#6b47d1]"
                onClick={() => onUse(suggestion)}
              >
                Use This
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SuggestionCard;
