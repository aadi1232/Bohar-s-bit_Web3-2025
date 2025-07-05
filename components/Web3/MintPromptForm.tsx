'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea, Card, CardBody, CardHeader } from '@nextui-org/react';
import { usePromptContract } from '@/hooks/usePromptContract';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { FaUpload, FaCoins } from 'react-icons/fa';
import toast from 'react-hot-toast';

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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <FaCoins className="text-blue-600 text-xl" />
          <h2 className="text-2xl font-bold">Mint AI Prompt NFT</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Prompt Title"
            placeholder="Enter a catchy title for your prompt"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
            variant="bordered"
            className="w-full"
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe what your prompt does and what makes it valuable"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            variant="bordered"
            rows={3}
            className="w-full"
          />

          {/* Prompt Content */}
          <Textarea
            label="Prompt Content"
            placeholder="Enter your AI prompt here..."
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            required
            variant="bordered"
            rows={4}
            className="w-full"
          />

          {/* Category */}
          <Input
            label="Category"
            placeholder="e.g., Art, Writing, Code, Marketing"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            variant="bordered"
            className="w-full"
          />

          {/* Tags */}
          <Input
            label="Tags"
            placeholder="Enter tags separated by commas (e.g., creative, portrait, detailed)"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            variant="bordered"
            className="w-full"
          />

          {/* Image URL */}
          <Input
            label="Preview Image URL (Optional)"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            variant="bordered"
            className="w-full"
          />

          {/* Royalty Percentage */}
          <div className="space-y-2">
            <Input
              type="number"
              label="Creator Royalty (%)"
              placeholder="2.5"
              value={formData.royaltyPercentage.toString()}
              onChange={(e) => handleInputChange('royaltyPercentage', Math.min(10, Math.max(0, parseFloat(e.target.value) || 0)))}
              min="0"
              max="10"
              step="0.5"
              description="Royalty percentage you'll receive from future sales (0-10%)"
            />
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Please connect your wallet to mint NFTs
              </p>
            </div>
          )}

          {isConnected && !isCorrectNetwork && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Please switch to the correct network to continue
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || !isConnected || !isCorrectNetwork || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Minting...</span>
              </>
            ) : (
              <>
                <FaUpload className="text-sm" />
                <span>Mint NFT</span>
              </>
            )}
          </Button>
        </form>

        {/* Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">What happens when you mint?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your prompt becomes a unique NFT on the blockchain</li>
            <li>• You retain full ownership and can list it for sale</li>
            <li>• You'll earn royalties from future sales</li>
            <li>• Your prompt is permanently stored and verifiable</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default MintPromptForm;
