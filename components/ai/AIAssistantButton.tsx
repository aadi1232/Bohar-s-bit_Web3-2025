"use client";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FiZap, FiX } from "react-icons/fi";
import PromptSuggestionPanel from "./PromptSuggestionPanel";
import { PromptSuggestion } from "@/types/ai";

type Props = {
  onSuggestionSelect?: (suggestion: PromptSuggestion) => void;
  defaultCategory?: string;
};

const AIAssistantButton = ({ onSuggestionSelect, defaultCategory }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          isIconOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-[#835DED] hover:bg-[#6b47d1] animate-pulse'
          }`}
          size="lg"
        >
          {isOpen ? <FiX size={24} /> : <FiZap size={24} />}
        </Button>
      </div>

      {/* AI Suggestion Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <PromptSuggestionPanel 
              onSuggestionSelect={handleSuggestionSelect}
              defaultCategory={defaultCategory}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantButton;
