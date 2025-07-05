'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader } from '@nextui-org/react';
import { usePromptContract } from '@/hooks/usePromptContract';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { FaUpload, FaCoins, FaGem, FaRocket, FaStar, FaWallet, FaImage, FaTags, FaPercent, FaFileAlt, FaRobot } from 'react-icons/fa';
import { styles } from '@/utils/styles';
import toast from 'react-hot-toast';
import { AISuggestions } from './AISuggestions';
import { AIEnhancement } from './AIEnhancement';
import { AIAnalysis } from './AIAnalysis';
import { AIPromptSuggestion, AIEnhancementResult, AIAnalysisScore } from '@/lib/ai/types';

interface MintPromptFormProps {
  onMinted?: (tokenId: number) => void;
}

export const MintPromptForm: React.FC<MintPromptFormProps> = ({ onMinted }) => {
  const { isConnected, isCorrectNetwork } = useWeb3();
  const { mintPrompt, isLoading } = usePromptContract();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    category: '',
    tags: '',
    imageUrl: '',
    royaltyPercentage: 5,
  });

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisScore | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle AI suggestion selection
  const handleSuggestionSelect = (suggestion: AIPromptSuggestion) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion.title,
      description: suggestion.description,
      prompt: suggestion.prompt,
      category: suggestion.category,
      tags: suggestion.tags.join(', '),
      royaltyPercentage: prev.royaltyPercentage
    }));
    toast.success('AI suggestion applied successfully!');
  };

  // Handle AI enhancement
  const handleEnhancement = (enhancement: AIEnhancementResult) => {
    setFormData(prev => ({
      ...prev,
      prompt: enhancement.enhancedPrompt
    }));
    toast.success('Prompt enhanced successfully!');
  };

  // Handle AI analysis completion
  const handleAnalysisComplete = (analysis: AIAnalysisScore) => {
    setAiAnalysis(analysis);
    // Auto-fill optimal price if analysis suggests it
    if (analysis.priceRecommendation.optimal) {
      const optimalPriceEth = parseFloat(analysis.priceRecommendation.optimal);
      // Convert to rough royalty percentage (this is just for UX, actual pricing happens during listing)
      const suggestedRoyalty = Math.min(10, Math.max(2, optimalPriceEth * 100));
      setFormData(prev => ({
        ...prev,
        royaltyPercentage: Math.round(suggestedRoyalty * 2) / 2 // Round to nearest 0.5
      }));
    }
  };

  const createMetadata = () => {
    return {
      name: formData.title,
      description: formData.description,
      prompt: formData.prompt,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: formData.imageUrl,
      attributes: [
        {
          trait_type: 'Category',
          value: formData.category
        },
        {
          trait_type: 'Tags',
          value: formData.tags
        },
        {
          trait_type: 'Creator Royalty',
          value: `${formData.royaltyPercentage}%`
        }
      ],
      external_url: '', // Could be a link to your marketplace
      animation_url: '', // Could be used for interactive prompts
      created_at: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !isCorrectNetwork) {
      toast.error('Please connect your wallet and switch to the correct network');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.prompt) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create metadata
      const metadata = createMetadata();
      
      // In a real application, you would upload this to IPFS or another storage service
      // For now, we'll just use a JSON string as the tokenURI
      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      
      // Mint the NFT
      const tokenId = await mintPrompt({
        tokenURI,
        royaltyPercentage: formData.royaltyPercentage
      });
      
      if (tokenId) {
        toast.success(`Prompt NFT minted successfully! Token ID: ${tokenId}`);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          prompt: '',
          category: '',
          tags: '',
          imageUrl: '',
          royaltyPercentage: 5,
        });
        
        // Callback
        onMinted?.(tokenId);
      }
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint prompt NFT');
    }
  };

  const isFormValid = formData.title && formData.description && formData.prompt;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                <FaGem className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white font-Monserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                  Mint Your AI Prompt
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Transform your AI prompts into valuable NFTs on the blockchain
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full mb-8"></div>
            
            {/* Status Cards */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-[#130f23] border border-[#835DED]/30 px-4 py-2 rounded-full">
                <FaWallet className="text-[#835DED] text-sm" />
                <span className="text-white font-medium">
                  {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-[#130f23] border border-[#FF7E5F]/30 px-4 py-2 rounded-full">
                <FaRocket className="text-[#FF7E5F] text-sm" />
                <span className="text-white font-medium">Ready to Mint</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                    <FaCoins className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create Your NFT</h2>
                    <p className="text-gray-400">Fill in the details to mint your AI prompt</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardBody className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* AI Tools Section */}
                  <Card className="p-6 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                          <FaRobot className="text-white text-lg" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">AI-Powered Tools</h3>
                          <p className="text-gray-400">Get suggestions, enhance your prompt, and analyze quality</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* AI Suggestions */}
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold text-sm">Get AI Suggestions</h4>
                          <AISuggestions 
                            category={formData.category}
                            onSelectSuggestion={handleSuggestionSelect}
                          />
                          <p className="text-gray-400 text-xs">Generate creative prompt ideas based on your category</p>
                        </div>

                        {/* AI Enhancement */}
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold text-sm">Enhance Prompt</h4>
                          <AIEnhancement
                            prompt={formData.prompt}
                            category={formData.category}
                            onEnhancement={handleEnhancement}
                          />
                          <p className="text-gray-400 text-xs">Improve your prompt with AI optimization</p>
                        </div>

                        {/* AI Analysis */}
                        <div className="space-y-2">
                          <h4 className="text-white font-semibold text-sm">Quality Analysis</h4>
                          <AIAnalysis
                            prompt={formData.prompt}
                            title={formData.title}
                            description={formData.description}
                            category={formData.category}
                            tags={formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)}
                            onAnalysisComplete={handleAnalysisComplete}
                          />
                          <p className="text-gray-400 text-xs">Get AI-powered quality score and pricing insights</p>
                        </div>
                      </div>

                      {/* AI Analysis Results Summary */}
                      {aiAnalysis && (
                        <div className="mt-6 p-4 bg-[#1a0f3a] rounded-lg border border-[#835DED]/20">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold">AI Analysis Summary</h4>
                            <div className="text-2xl font-bold text-[#835DED]">{aiAnalysis.overallScore}/100</div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Clarity:</span>
                              <span className="text-white ml-2">{aiAnalysis.breakdown.clarity}/100</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Creativity:</span>
                              <span className="text-white ml-2">{aiAnalysis.breakdown.creativity}/100</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Market Ranking:</span>
                              <span className="text-white ml-2">{aiAnalysis.marketComparison.ranking}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Optimal Price:</span>
                              <span className="text-[#FF7E5F] ml-2 font-semibold">{aiAnalysis.priceRecommendation.optimal} ETH</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>

                  {/* Title and Description Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <FaFileAlt className="text-[#835DED] text-sm" />
                        <label className="text-white font-medium">Prompt Title *</label>
                      </div>
                      <Input
                        placeholder="Enter a catchy title for your prompt"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                        className="bg-[#1a0f3a]"
                        classNames={{
                          input: "text-white placeholder:text-gray-400 text-lg",
                          inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300 h-12",
                        }}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <FaTags className="text-[#835DED] text-sm" />
                        <label className="text-white font-medium">Category</label>
                      </div>
                      <Input
                        placeholder="e.g., Art, Writing, Code, Marketing"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="bg-[#1a0f3a]"
                        classNames={{
                          input: "text-white placeholder:text-gray-400 text-lg",
                          inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300 h-12",
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaFileAlt className="text-[#835DED] text-sm" />
                      <label className="text-white font-medium">Description *</label>
                    </div>
                    <Textarea
                      placeholder="Describe what your prompt does and what makes it valuable"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      rows={4}
                      className="bg-[#1a0f3a]"
                      classNames={{
                        input: "text-white placeholder:text-gray-400 text-lg",
                        inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300",
                      }}
                    />
                  </div>

                  {/* Prompt Content */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaGem className="text-[#FF7E5F] text-sm" />
                      <label className="text-white font-medium">Prompt Content *</label>
                    </div>
                    <Textarea
                      placeholder="Enter your AI prompt here..."
                      value={formData.prompt}
                      onChange={(e) => handleInputChange('prompt', e.target.value)}
                      required
                      rows={6}
                      className="bg-[#1a0f3a]"
                      classNames={{
                        input: "text-white placeholder:text-gray-400 text-lg font-mono",
                        inputWrapper: "bg-[#1a0f3a] border border-[#FF7E5F]/30 hover:border-[#FF7E5F]/50 focus-within:border-[#FF7E5F] transition-all duration-300",
                      }}
                    />
                  </div>

                  {/* Tags and Image URL Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <FaTags className="text-[#835DED] text-sm" />
                        <label className="text-white font-medium">Tags</label>
                      </div>
                      <Input
                        placeholder="creative, portrait, detailed (comma separated)"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        className="bg-[#1a0f3a]"
                        classNames={{
                          input: "text-white placeholder:text-gray-400 text-lg",
                          inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300 h-12",
                        }}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="flex items-center space-x-2 mb-3">
                        <FaImage className="text-[#835DED] text-sm" />
                        <label className="text-white font-medium">Preview Image URL</label>
                      </div>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        className="bg-[#1a0f3a]"
                        classNames={{
                          input: "text-white placeholder:text-gray-400 text-lg",
                          inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300 h-12",
                        }}
                      />
                    </div>
                  </div>

                  {/* Royalty Percentage */}
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaPercent className="text-[#FF7E5F] text-sm" />
                      <label className="text-white font-medium">Creator Royalty (%)</label>
                    </div>
                    <Input
                      type="number"
                      placeholder="2.5"
                      value={formData.royaltyPercentage.toString()}
                      onChange={(e) => handleInputChange('royaltyPercentage', Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
                      min="0"
                      max="10"
                      step="0.5"
                      description="Royalty percentage you'll receive from future sales (0-10%)"
                      className="bg-[#1a0f3a]"
                      classNames={{
                        input: "text-white placeholder:text-gray-400 text-lg",
                        inputWrapper: "bg-[#1a0f3a] border border-[#FF7E5F]/30 hover:border-[#FF7E5F]/50 focus-within:border-[#FF7E5F] transition-all duration-300 h-12",
                        description: "text-gray-400 text-sm mt-2",
                      }}
                    />
                  </div>

                  {/* Connection Status */}
                  {!isConnected && (
                    <Card className="p-6 bg-red-900/20 border border-red-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <FaWallet className="text-red-400" />
                        </div>
                        <p className="text-red-300 font-medium">
                          Please connect your wallet to mint NFTs
                        </p>
                      </div>
                    </Card>
                  )}

                  {isConnected && !isCorrectNetwork && (
                    <Card className="p-6 bg-yellow-900/20 border border-yellow-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <FaRocket className="text-yellow-400" />
                        </div>
                        <p className="text-yellow-300 font-medium">
                          Please switch to the correct network to continue
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || !isConnected || !isCorrectNetwork || isLoading}
                    className="w-full bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-bold py-4 text-lg rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Minting Your NFT...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <FaUpload className="text-lg" />
                        <span>Mint NFT</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Info Section - Takes 1/3 of the width */}
          <div className="space-y-6">
            {/* Why Mint Section */}
            <Card className="p-6 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                    <FaStar className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Why Mint Your Prompts?</h3>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#835DED]/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[#835DED] text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 leading-relaxed">
                      Prove ownership and authenticity of your AI prompts
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#835DED]/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[#835DED] text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 leading-relaxed">
                      Earn royalties from every future sale
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#835DED]/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[#835DED] text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 leading-relaxed">
                      Build your reputation as a prompt creator
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#835DED]/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[#835DED] text-xs">✓</span>
                    </div>
                    <span className="text-gray-300 leading-relaxed">
                      Create a passive income stream
                    </span>
                  </li>
                </ul>
              </CardBody>
            </Card>

            {/* How It Works Section */}
            <Card className="p-6 bg-[#130f23] border border-[#FF7E5F]/20 hover:border-[#FF7E5F]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF7E5F] to-[#835DED] rounded-full flex items-center justify-center">
                    <FaRocket className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-white">How It Works</h3>
                </div>
              </CardHeader>
              <CardBody>
                <ol className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <span className="text-gray-300 leading-relaxed">
                      Fill out the form with your prompt details
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <span className="text-gray-300 leading-relaxed">
                      Set your royalty percentage (0-10%)
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <span className="text-gray-300 leading-relaxed">
                      Confirm the transaction in your wallet
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <span className="text-gray-300 leading-relaxed">
                      Your NFT is minted and ready to list!
                    </span>
                  </li>
                </ol>
              </CardBody>
            </Card>

            {/* Information Card */}
            <Card className="p-6 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                    <FaGem className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-white">What Happens Next?</h3>
                </div>
              </CardHeader>
              <CardBody>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#835DED] text-sm">•</span>
                    <span className="text-sm">Your prompt becomes a unique NFT on the blockchain</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#835DED] text-sm">•</span>
                    <span className="text-sm">You retain full ownership and can list it for sale</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#835DED] text-sm">•</span>
                    <span className="text-sm">You'll earn royalties from future sales</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#835DED] text-sm">•</span>
                    <span className="text-sm">Your prompt is permanently stored and verifiable</span>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintPromptForm;
