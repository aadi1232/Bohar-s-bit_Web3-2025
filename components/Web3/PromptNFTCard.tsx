'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@nextui-org/react';
import { PromptNFT } from '@/hooks/usePromptContract';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { usePromptContract } from '@/hooks/usePromptContract';
import { FaEthereum, FaTag, FaUser, FaShoppingCart, FaEye, FaUnlock } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface PromptNFTCardProps {
  prompt: PromptNFT;
  onUpdate?: () => void;
  showOwnerActions?: boolean;
}

export const PromptNFTCard: React.FC<PromptNFTCardProps> = ({ 
  prompt, 
  onUpdate, 
  showOwnerActions = false 
}) => {
  const { address, isConnected, isCorrectNetwork } = useWeb3();
  const { listPrompt, unlistPrompt, buyPrompt, isLoading } = usePromptContract();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [listPrice, setListPrice] = useState('');
  const [showPromptContent, setShowPromptContent] = useState(false);

  const isOwner = address && prompt.owner.toLowerCase() === address.toLowerCase();
  const canBuy = isConnected && !isOwner && prompt.isListed;

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
      <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold truncate">
                {metadata?.name || `Prompt #${prompt.tokenId}`}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {metadata?.description || 'No description available'}
              </p>
            </div>
            <Chip
              color={prompt.isListed ? 'success' : 'default'}
              size="sm"
              variant="flat"
            >
              {prompt.isListed ? 'Listed' : 'Not Listed'}
            </Chip>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          {/* Preview Image */}
          {metadata?.image && (
            <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={metadata.image} 
                alt={metadata.name || `Prompt #${prompt.tokenId}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Price */}
          {prompt.isListed && prompt.price && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FaEthereum className="text-blue-600" />
              <span className="font-semibold text-lg">{prompt.price} ETH</span>
            </div>
          )}

          {/* Owner Info */}
          <div className="flex items-center space-x-2 text-sm">
            <FaUser className="text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Owner:</span>
            <Button
              size="sm"
              variant="light"
              className="p-1 h-auto min-w-0"
              onClick={() => copyToClipboard(prompt.owner, 'Address')}
            >
              <span className="font-mono">{formatAddress(prompt.owner)}</span>
              <HiOutlineExternalLink className="ml-1 text-xs" />
            </Button>
          </div>

          {/* Category and Tags */}
          {metadata?.category && (
            <div className="flex items-center space-x-2">
              <FaTag className="text-gray-400 text-sm" />
              <Chip size="sm" variant="flat" color="primary">
                {metadata.category}
              </Chip>
            </div>
          )}

          {metadata?.tags && Array.isArray(metadata.tags) && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {metadata.tags.slice(0, 3).map((tag: string, index: number) => (
                <Chip key={index} size="sm" variant="flat" color="secondary">
                  {tag}
                </Chip>
              ))}
              {metadata.tags.length > 3 && (
                <Chip size="sm" variant="flat" color="default">
                  +{metadata.tags.length - 3} more
                </Chip>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            {/* View Prompt Button */}
            <Button
              onClick={() => setShowPromptContent(!showPromptContent)}
              variant="flat"
              className="w-full flex items-center justify-center space-x-2"
            >
              <FaEye />
              <span>{showPromptContent ? 'Hide' : 'View'} Prompt</span>
            </Button>

            {/* Prompt Content */}
            {showPromptContent && metadata?.prompt && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium mb-2">Prompt Content:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {metadata.prompt}
                </p>
                <Button
                  size="sm"
                  variant="light"
                  className="mt-2"
                  onClick={() => copyToClipboard(metadata.prompt, 'Prompt')}
                >
                  <span className="text-xs">Copy to Clipboard</span>
                </Button>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && showOwnerActions && (
              <div className="flex space-x-2">
                {!prompt.isListed ? (
                  <Button
                    onClick={onOpen}
                    disabled={!isConnected || !isCorrectNetwork || isLoading}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                  >
                    <FaTag className="mr-2" />
                    List for Sale
                  </Button>
                ) : (
                  <Button
                    onClick={handleUnlist}
                    disabled={!isConnected || !isCorrectNetwork || isLoading}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
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
                className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <FaShoppingCart />
                <span>Buy for {prompt.price} ETH</span>
              </Button>
            )}

            {/* Connection Status */}
            {!isConnected && canBuy && (
              <div className="text-xs text-gray-500 text-center">
                Connect wallet to purchase
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* List Modal */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            List Prompt for Sale
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Set a price for your prompt NFT
                </p>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  label="Price in ETH"
                  placeholder="0.1"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">ETH</span>
                    </div>
                  }
                />
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Once listed, buyers can purchase your prompt immediately. 
                  You'll receive the full amount minus any royalties to the original creator.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleList}
              disabled={!listPrice || parseFloat(listPrice) <= 0 || isLoading}
            >
              {isLoading ? 'Listing...' : 'List for Sale'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
