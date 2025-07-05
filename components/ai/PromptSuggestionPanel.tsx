"use client";
import { styles } from "@/utils/styles";
import { Button, Card, CardBody, Input, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useState } from "react";
import { useAISuggestions } from "@/hooks/useAISuggestions";
import SuggestionCard from "./SuggestionCard";
import { PromptSuggestion } from "@/types/ai";
import { FiRefreshCw, FiZap } from "react-icons/fi";

type Props = {
  onSuggestionSelect?: (suggestion: PromptSuggestion) => void;
  defaultCategory?: string;
};

const categories = [
  { value: "Chatgpt", label: "ChatGPT" },
  { value: "Midjourney", label: "Midjourney" },
  { value: "Dalle", label: "DALL-E" },
  { value: "Bard", label: "Bard" },
];

const difficulties = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const PromptSuggestionPanel = ({ onSuggestionSelect, defaultCategory }: Props) => {
  const [category, setCategory] = useState(defaultCategory || "Chatgpt");
  const [keywords, setKeywords] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [targetAudience, setTargetAudience] = useState("");
  
  const { suggestions, loading, generateSuggestions, clearSuggestions } = useAISuggestions();

  const handleGenerateSuggestions = async () => {
    await generateSuggestions({
      category,
      keywords: keywords.trim() || undefined,
      difficulty,
      targetAudience: targetAudience.trim() || undefined,
    });
  };

  const handleSuggestionUse = (suggestion: PromptSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  return (
    <Card className="w-full bg-[#1a1a2e] border border-[#16213e]">
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiZap className="text-[#835DED] text-xl" />
          <h3 className={`${styles.heading} !text-xl`}>
            AI Prompt Suggestions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full"
            variant="bordered"
          >
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="text-black">
                {cat.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Difficulty Level"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full"
            variant="bordered"
          >
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value} className="text-black">
                {diff.label}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Keywords (optional)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., business, creative, automation"
            variant="bordered"
          />

          <Input
            label="Target Audience (optional)"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="e.g., marketers, writers, developers"
            variant="bordered"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleGenerateSuggestions}
            disabled={loading}
            className="bg-[#835DED] text-white hover:bg-[#6b47d1]"
            startContent={loading ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
          >
            {loading ? 'Generating...' : 'Generate Suggestions'}
          </Button>
          
          {suggestions.length > 0 && (
            <Button
              variant="flat"
              onClick={clearSuggestions}
              className="bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
            >
              Clear
            </Button>
          )}
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="w-full bg-[#0f0f23]">
                <CardBody className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2 rounded-lg" />
                  <Skeleton className="h-3 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-16 w-full mb-4 rounded-lg" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="space-y-4">
            <p className={`${styles.label} text-center`}>
              Found {suggestions.length} AI-generated suggestions
            </p>
            {suggestions.map((suggestion, index) => (
              <SuggestionCard
                key={`${suggestion.id}-${index}`}
                suggestion={suggestion}
                onUse={onSuggestionSelect ? handleSuggestionUse : undefined}
              />
            ))}
          </div>
        )}

        {!loading && suggestions.length === 0 && keywords.trim() && (
          <div className="text-center py-8">
            <p className={`${styles.paragraph} mb-4`}>
              No suggestions generated yet. Click "Generate Suggestions" to get AI-powered prompt ideas!
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PromptSuggestionPanel;
