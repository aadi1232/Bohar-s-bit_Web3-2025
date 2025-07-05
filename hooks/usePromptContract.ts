'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { CONTRACT_CONFIG, CONTRACT_ABI } from '@/lib/contractConfig';
import toast from 'react-hot-toast';

export interface PromptNFT {
  tokenId: number;
  owner: string;
  tokenURI: string;
  isListed: boolean;
  price?: string;
  seller?: string;
}

export interface ListingInfo {
  seller: string;
  price: string;
  isListed: boolean;
}

export interface MintParams {
  tokenURI: string;
  royaltyPercentage: number; // 0-100
}

export interface ListParams {
  tokenId: number;
  priceInEth: string;
}

export const usePromptContract = () => {
  const { signer, provider, isConnected, isCorrectNetwork } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract instance
  const getContract = useCallback(() => {
    if (!signer || !isCorrectNetwork) {
      throw new Error('Please connect wallet and switch to the correct network');
    }
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_ABI, signer);
  }, [signer, isCorrectNetwork]);

  // Get read-only contract instance
  const getReadOnlyContract = useCallback(() => {
    if (!provider) {
      throw new Error('Provider not available');
    }
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_ABI, provider);
  }, [provider]);

  // Handle contract errors
  const handleError = (err: any, defaultMessage: string) => {
    console.error('Contract error:', err);
    let errorMessage = defaultMessage;
    
    if (err?.reason) {
      errorMessage = err.reason;
    } else if (err?.message) {
      if (err.message.includes('user rejected')) {
        errorMessage = 'Transaction was rejected by user';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction';
      } else if (err.message.includes('execution reverted')) {
        errorMessage = 'Transaction failed - contract requirements not met';
      } else {
        errorMessage = err.message;
      }
    }
    
    setError(errorMessage);
    toast.error(errorMessage);
    return errorMessage;
  };

  // Mint a new prompt NFT
  const mintPrompt = async ({ tokenURI, royaltyPercentage }: MintParams): Promise<number | null> => {
    if (!isConnected || !isCorrectNetwork) {
      toast.error('Please connect wallet and switch to the correct network');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      const royaltyBips = Math.floor(royaltyPercentage * 100); // Convert percentage to basis points
      
      toast.loading('Minting prompt NFT...', { id: 'mint' });
      
      const tx = await contract.mintPrompt(tokenURI, royaltyBips);
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const mintEvent = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id('PromptMinted(address,uint256,string)')
      );
      
      let tokenId = null;
      if (mintEvent) {
        const decodedLog = contract.interface.parseLog(mintEvent);
        tokenId = Number(decodedLog?.args?.tokenId);
      }

      toast.success('Prompt NFT minted successfully!', { id: 'mint' });
      return tokenId;
    } catch (err: any) {
      handleError(err, 'Failed to mint prompt NFT');
      toast.dismiss('mint');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // List a prompt for sale
  const listPrompt = async ({ tokenId, priceInEth }: ListParams): Promise<boolean> => {
    if (!isConnected || !isCorrectNetwork) {
      toast.error('Please connect wallet and switch to the correct network');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      const priceInWei = ethers.parseEther(priceInEth);
      
      toast.loading('Listing prompt...', { id: 'list' });
      
      const tx = await contract.listPrompt(tokenId, priceInWei);
      await tx.wait();
      
      toast.success('Prompt listed successfully!', { id: 'list' });
      return true;
    } catch (err: any) {
      handleError(err, 'Failed to list prompt');
      toast.dismiss('list');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unlist a prompt
  const unlistPrompt = async (tokenId: number): Promise<boolean> => {
    if (!isConnected || !isCorrectNetwork) {
      toast.error('Please connect wallet and switch to the correct network');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      
      toast.loading('Unlisting prompt...', { id: 'unlist' });
      
      const tx = await contract.unlistPrompt(tokenId);
      await tx.wait();
      
      toast.success('Prompt unlisted successfully!', { id: 'unlist' });
      return true;
    } catch (err: any) {
      handleError(err, 'Failed to unlist prompt');
      toast.dismiss('unlist');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Buy a prompt
  const buyPrompt = async (tokenId: number, priceInEth: string): Promise<boolean> => {
    if (!isConnected || !isCorrectNetwork) {
      toast.error('Please connect wallet and switch to the correct network');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = getContract();
      const priceInWei = ethers.parseEther(priceInEth);
      
      toast.loading('Purchasing prompt...', { id: 'buy' });
      
      const tx = await contract.buyPrompt(tokenId, { value: priceInWei });
      await tx.wait();
      
      toast.success('Prompt purchased successfully!', { id: 'buy' });
      return true;
    } catch (err: any) {
      handleError(err, 'Failed to purchase prompt');
      toast.dismiss('buy');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get all listed prompts
  const getAllListedPrompts = async (): Promise<PromptNFT[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = getReadOnlyContract();
      const tokenIds = await contract.getAllListedPrompts();
      
      const prompts: PromptNFT[] = [];
      
      for (const tokenId of tokenIds) {
        try {
          const [owner, tokenURI] = await contract.getPromptDetails(Number(tokenId));
          const [seller, price, isListed] = await contract.getListing(Number(tokenId));
          
          prompts.push({
            tokenId: Number(tokenId),
            owner,
            tokenURI,
            isListed,
            price: isListed ? ethers.formatEther(price) : undefined,
            seller: isListed ? seller : undefined,
          });
        } catch (err) {
          console.error(`Error fetching details for token ${tokenId}:`, err);
        }
      }
      
      return prompts;
    } catch (err: any) {
      handleError(err, 'Failed to fetch listed prompts');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get prompts owned by a specific address
  const getPromptsByOwner = async (ownerAddress: string): Promise<PromptNFT[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = getReadOnlyContract();
      const tokenIds = await contract.getPromptsByOwner(ownerAddress);
      
      const prompts: PromptNFT[] = [];
      
      for (const tokenId of tokenIds) {
        try {
          const [owner, tokenURI] = await contract.getPromptDetails(Number(tokenId));
          const [seller, price, isListed] = await contract.getListing(Number(tokenId));
          
          prompts.push({
            tokenId: Number(tokenId),
            owner,
            tokenURI,
            isListed,
            price: isListed ? ethers.formatEther(price) : undefined,
            seller: isListed ? seller : undefined,
          });
        } catch (err) {
          console.error(`Error fetching details for token ${tokenId}:`, err);
        }
      }
      
      return prompts;
    } catch (err: any) {
      handleError(err, 'Failed to fetch owned prompts');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get specific prompt details
  const getPromptDetails = async (tokenId: number): Promise<PromptNFT | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = getReadOnlyContract();
      const [owner, tokenURI] = await contract.getPromptDetails(tokenId);
      const [seller, price, isListed] = await contract.getListing(tokenId);
      
      return {
        tokenId,
        owner,
        tokenURI,
        isListed,
        price: isListed ? ethers.formatEther(price) : undefined,
        seller: isListed ? seller : undefined,
      };
    } catch (err: any) {
      handleError(err, 'Failed to fetch prompt details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get listing info for a specific token
  const getListingInfo = async (tokenId: number): Promise<ListingInfo | null> => {
    try {
      const contract = getReadOnlyContract();
      const [seller, price, isListed] = await contract.getListing(tokenId);
      
      return {
        seller,
        price: ethers.formatEther(price),
        isListed,
      };
    } catch (err: any) {
      handleError(err, 'Failed to fetch listing info');
      return null;
    }
  };

  // Get all prompts (minted)
  const getAllPrompts = async (): Promise<PromptNFT[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const contract = getReadOnlyContract();
      const tokenIds = await contract.getAllPrompts();
      
      const prompts: PromptNFT[] = [];
      
      for (const tokenId of tokenIds) {
        try {
          const [owner, tokenURI] = await contract.getPromptDetails(Number(tokenId));
          const [seller, price, isListed] = await contract.getListing(Number(tokenId));
          
          prompts.push({
            tokenId: Number(tokenId),
            owner,
            tokenURI,
            isListed,
            price: isListed ? ethers.formatEther(price) : undefined,
            seller: isListed ? seller : undefined,
          });
        } catch (err) {
          console.error(`Error fetching details for token ${tokenId}:`, err);
        }
      }
      
      return prompts;
    } catch (err: any) {
      handleError(err, 'Failed to fetch all prompts');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,
    error,
    
    // Contract functions
    mintPrompt,
    listPrompt,
    unlistPrompt,
    buyPrompt,
    
    // Query functions
    getAllListedPrompts,
    getPromptsByOwner,
    getPromptDetails,
    getListingInfo,
    getAllPrompts,
    
    // Utility
    clearError: () => setError(null),
  };
};
