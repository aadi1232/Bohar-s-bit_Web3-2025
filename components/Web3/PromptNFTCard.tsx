'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@nextui-org/react';
import { PromptNFT } from '@/hooks/usePromptContract';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { usePromptContract } from '@/hooks/usePromptContract';
import { FaEthereum, FaTag, FaUser, FaShoppingCart, FaEye, FaUnlock, FaLock, FaGem, FaCrown, FaStar } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { styles } from '@/utils/styles';
import toast from 'react-hot-toast';

interface PromptNFTCardProps {
  prompt: PromptNFT;
  onUpdate?: () => void;
  showOwnerActions?: boolean;
  purchasedPrompts?: number[]; // Array of token IDs that the user has purchased
}

export const PromptNFTCard: React.FC<PromptNFTCardProps> = ({ 
  prompt, 
  onUpdate, 
  showOwnerActions = false,
  purchasedPrompts = []
}) => {
  const { address, isConnected, isCorrectNetwork } = useWeb3();
  const { listPrompt, unlistPrompt, buyPrompt, isLoading } = usePromptContract();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listPrice, setListPrice] = useState('');
  const [showPromptContent, setShowPromptContent] = useState(false);

  const isOwner = address && prompt.owner.toLowerCase() === address.toLowerCase();
  const canBuy = isConnected && !isOwner && prompt.isListed;
  const hasAccessToPrompt = isOwner || purchasedPrompts.includes(prompt.tokenId);

  // Parse metadata from tokenURI
  const parseMetadata = () => {
    try {
      if (prompt.tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = prompt.tokenURI.replace('data:application/json;base64,', '');
        return JSON.parse(atob(base64Data));
      }
      return null;
    } catch (error) {
      console.error('Error parsing metadata:', error);
      return null;
    }
  };

  const metadata = parseMetadata();

  const handleList = async () => {
    if (!listPrice || parseFloat(listPrice) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const success = await listPrompt({
      tokenId: prompt.tokenId,
      priceInEth: listPrice
    });

    if (success) {
      onUpdate?.();
      onClose();
      setListPrice('');
    }
  };

  const handleUnlist = async () => {
    const success = await unlistPrompt(prompt.tokenId);
    if (success) {
      onUpdate?.();
    }
  };

  const handleBuy = async () => {
    if (!prompt.price) return;

    const success = await buyPrompt(prompt.tokenId, prompt.price);
    if (success) {
      onUpdate?.();
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <>
      <div className="group relative">
        {/* Animated Background Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        
        <Card className="relative bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm">
          <CardHeader className="pb-4 relative overflow-hidden">
            {/* Header Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#835DED]/5 to-[#FF7E5F]/5"></div>
            
            <div className="relative z-10 flex justify-between items-start w-full">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                    <FaGem className="text-white text-sm" />
                  </div>
                  <h3 className="text-xl font-bold text-white truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#835DED] group-hover:to-[#FF7E5F] transition-all duration-300">
                    {metadata?.name || `Prompt #${prompt.tokenId}`}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                  {metadata?.description || 'No description available'}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <Chip
                  className={`${
                    prompt.isListed 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300' 
                      : 'bg-gray-500/20 border-gray-500/30 text-gray-300'
                  } border backdrop-blur-sm`}
                  size="sm"
                  variant="bordered"
                >
                  {prompt.isListed ? 'Listed' : 'Not Listed'}
                </Chip>
                
                {isOwner && (
                  <div className="flex items-center space-x-1 bg-[#835DED]/20 border border-[#835DED]/30 px-2 py-1 rounded-full">
                    <FaCrown className="text-[#835DED] text-xs" />
                    <span className="text-[#835DED] text-xs font-medium">Owned</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-6 relative">
            {/* Preview Image */}
            {metadata?.image && (
              <div className="relative w-full h-48 bg-gradient-to-br from-[#835DED]/10 to-[#FF7E5F]/10 rounded-xl overflow-hidden border border-[#835DED]/20">
                <img 
                  src={metadata.image} 
                  alt={metadata.name || `Prompt #${prompt.tokenId}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}

            {/* Price Section */}
            {prompt.isListed && prompt.price && (
              <div className="relative">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 rounded-xl border border-[#835DED]/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                      <FaEthereum className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-white font-bold text-xl">{prompt.price} ETH</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-gray-300 text-sm">Premium</span>
                  </div>
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="flex items-center justify-between p-3 bg-[#1a0f3a]/50 rounded-xl border border-[#835DED]/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#835DED]/20 to-[#FF7E5F]/20 rounded-full flex items-center justify-center border border-[#835DED]/30">
                  <FaUser className="text-[#835DED] text-sm" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Owner</p>
                  <p className="text-white text-sm font-mono">{formatAddress(prompt.owner)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="light"
                className="text-[#835DED] hover:bg-[#835DED]/10 transition-colors duration-200"
                onClick={() => copyToClipboard(prompt.owner, 'Address')}
              >
                <HiOutlineExternalLink className="text-sm" />
              </Button>
            </div>

            {/* Category and Tags */}
            <div className="space-y-3">
              {metadata?.category && (
                <div className="flex items-center space-x-2">
                  <FaTag className="text-[#835DED] text-sm" />
                  <Chip 
                    className="bg-gradient-to-r from-[#835DED]/20 to-[#FF7E5F]/20 border-[#835DED]/30 text-[#835DED]" 
                    size="sm" 
                    variant="bordered"
                  >
                    {metadata.category}
                  </Chip>
                </div>
              )}

              {metadata?.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.slice(0, 3).map((tag: string, index: number) => (
                    <Chip 
                      key={index} 
                      className="bg-[#835DED]/10 border-[#835DED]/30 text-[#835DED] text-xs" 
                      size="sm" 
                      variant="bordered"
                    >
                      {tag}
                    </Chip>
                  ))}
                  {metadata.tags.length > 3 && (
                    <Chip 
                      className="bg-gray-500/10 border-gray-500/30 text-gray-300 text-xs" 
                      size="sm" 
                      variant="bordered"
                    >
                      +{metadata.tags.length - 3}
                    </Chip>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {/* View/Access Prompt Button */}
              {hasAccessToPrompt ? (
                <Button
                  onClick={() => setShowPromptContent(!showPromptContent)}
                  className="w-full bg-gradient-to-r from-[#835DED]/20 to-[#FF7E5F]/20 border border-[#835DED]/40 text-white hover:from-[#835DED]/30 hover:to-[#FF7E5F]/30 transition-all duration-300 hover:scale-105"
                  variant="bordered"
                >
                  <FaEye className="mr-2" />
                  <span>{showPromptContent ? 'Hide' : 'View'} Prompt Content</span>
                </Button>
              ) : (
                <div className="relative">
                  <Button
                    disabled
                    className="w-full bg-gray-500/10 border border-gray-500/30 text-gray-400 cursor-not-allowed"
                    variant="bordered"
                  >
                    <FaLock className="mr-2" />
                    <span>Prompt Locked</span>
                  </Button>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#835DED]/5 to-[#FF7E5F]/5 rounded-lg pointer-events-none"></div>
                </div>
              )}

              {/* Prompt Content - Only visible if user has access */}
              {showPromptContent && hasAccessToPrompt && metadata?.prompt && (
                <div className="p-4 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 rounded-xl border border-[#835DED]/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                        <FaGem className="text-white text-xs" />
                      </div>
                      <p className="text-white font-semibold text-sm">Prompt Content</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-green-500/20 border border-green-500/30 px-2 py-1 rounded-full">
                      <FaUnlock className="text-green-400 text-xs" />
                      <span className="text-green-400 text-xs">Unlocked</span>
                    </div>
                  </div>
                  <div className="bg-[#1a0f3a]/50 p-3 rounded-lg border border-[#835DED]/20">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {metadata.prompt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="light"
                    className="mt-3 text-[#835DED] hover:bg-[#835DED]/10 transition-colors duration-200"
                    onClick={() => copyToClipboard(metadata.prompt, 'Prompt')}
                  >
                    <span className="text-sm">Copy to Clipboard</span>
                  </Button>
                </div>
              )}

              {/* Locked Prompt Preview */}
              {showPromptContent && !hasAccessToPrompt && (
                <div className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-xl border border-gray-500/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-500/20 rounded-full flex items-center justify-center">
                        <FaLock className="text-gray-400 text-xs" />
                      </div>
                      <p className="text-gray-400 font-semibold text-sm">Prompt Content</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded-full">
                      <FaLock className="text-red-400 text-xs" />
                      <span className="text-red-400 text-xs">Locked</span>
                    </div>
                  </div>
                  <div className="bg-[#1a0f3a]/50 p-3 rounded-lg border border-gray-500/20">
                    <p className="text-gray-500 text-sm font-mono leading-relaxed blur-sm select-none">
                      *** Purchase this prompt to unlock the content ***
                    </p>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-gray-400 text-xs">
                      🔒 Purchase this NFT to access the full prompt content
                    </p>
                  </div>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && showOwnerActions && (
                <div className="flex space-x-3">
                  {!prompt.isListed ? (
                    <Button
                      onClick={onOpen}
                      disabled={!isConnected || !isCorrectNetwork || isLoading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30"
                    >
                      <FaTag className="mr-2" />
                      List for Sale
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUnlist}
                      disabled={!isConnected || !isCorrectNetwork || isLoading}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
                    >
                      <FaUnlock className="mr-2" />
                      Unlist
                    </Button>
                  )}
                </div>
              )}

              {/* Buy Button */}
              {canBuy && (
                <Button
                  onClick={handleBuy}
                  disabled={!isConnected || !isCorrectNetwork || isLoading}
                  className="w-full bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <FaShoppingCart className="mr-2" />
                  <span>Buy for {prompt.price} ETH</span>
                </Button>
              )}

              {/* Connection Status */}
              {!isConnected && canBuy && (
                <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-400 text-sm font-medium">
                    Connect your wallet to purchase this prompt
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* List Modal */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center" className="bg-[#130f23] border border-[#835DED]/30">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                <FaTag className="text-white text-sm" />
              </div>
              <span>List Prompt for Sale</span>
            </div>
          </ModalHeader>
          <ModalBody className="bg-[#130f23]">
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 text-sm mb-4">
                  Set a price for your prompt NFT and make it available for purchase
                </p>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  label="Price in ETH"
                  placeholder="0.1"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="bg-[#1a0f3a]"
                  classNames={{
                    input: "text-white placeholder:text-gray-400",
                    inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300",
                    label: "text-gray-300",
                  }}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-gray-400 text-small">ETH</span>
                    </div>
                  }
                />
              </div>
              <div className="p-4 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 rounded-xl border border-[#835DED]/30 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#835DED]/20 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-[#835DED] text-xs">ℹ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Important Note</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Once listed, buyers can purchase your prompt immediately. You'll receive the full amount minus any royalties to the original creator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-[#130f23]">
            <Button 
              onPress={onClose}
              className="border-2 border-gray-500 text-gray-300 hover:bg-gray-500/10 transition-all duration-300"
              variant="bordered"
            >
              Cancel
            </Button>
            <Button
              onPress={handleList}
              disabled={!listPrice || parseFloat(listPrice) <= 0 || isLoading}
              className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              {isLoading ? 'Listing...' : 'List for Sale'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
