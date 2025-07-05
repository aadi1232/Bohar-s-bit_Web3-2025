'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Spinner } from '@nextui-org/react';
import { usePromptContract, PromptNFT } from '@/hooks/usePromptContract';
import { PromptNFTCard } from '@/components/Web3/PromptNFTCard';
import { FaSearch, FaStore, FaFilter, FaRedo, FaGem, FaRocket, FaStar } from 'react-icons/fa';
import { styles } from '@/utils/styles';
import { useWeb3 } from '@/components/Web3/Web3Provider';

interface MarketplaceProps {
  title?: string;
  showFilters?: boolean;
  maxItems?: number;
}

export const Web3Marketplace: React.FC<MarketplaceProps> = ({ 
  title = 'AI Prompt Marketplace', 
  showFilters = true,
  maxItems 
}) => {
  const { address } = useWeb3();
  const { getAllListedPrompts, isLoading } = usePromptContract();
  const [prompts, setPrompts] = useState<PromptNFT[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptNFT[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [purchasedPrompts, setPurchasedPrompts] = useState<number[]>([]);

  // Get purchased prompts for current user
  const getPurchasedPrompts = () => {
    if (!address) return [];
    
    // In a real implementation, you would fetch this from your backend or smart contract
    // For now, we'll use localStorage to simulate purchased prompts
    const stored = localStorage.getItem(`purchased_prompts_${address.toLowerCase()}`);
    return stored ? JSON.parse(stored) : [];
  };

  // Update purchased prompts when a purchase is made
  const updatePurchasedPrompts = (tokenId: number) => {
    if (!address) return;
    
    const currentPurchased = getPurchasedPrompts();
    if (!currentPurchased.includes(tokenId)) {
      const updated = [...currentPurchased, tokenId];
      localStorage.setItem(`purchased_prompts_${address.toLowerCase()}`, JSON.stringify(updated));
      setPurchasedPrompts(updated);
    }
  };

  // Load purchased prompts on component mount and address change
  useEffect(() => {
    if (address) {
      setPurchasedPrompts(getPurchasedPrompts());
    } else {
      setPurchasedPrompts([]);
    }
  }, [address]);

  // Fetch listed prompts
  const fetchPrompts = async () => {
    setIsRefreshing(true);
    try {
      const fetchedPrompts = await getAllListedPrompts();
      setPrompts(fetchedPrompts);
      setFilteredPrompts(fetchedPrompts);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle prompt purchase and update purchased list
  const handlePromptUpdate = (tokenId?: number) => {
    if (tokenId) {
      updatePurchasedPrompts(tokenId);
    }
    fetchPrompts();
  };

  // Initial fetch
  useEffect(() => {
    fetchPrompts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...prompts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(prompt => {
        const metadata = parseMetadata(prompt.tokenURI);
        const searchLower = searchTerm.toLowerCase();
        return (
          metadata?.name?.toLowerCase().includes(searchLower) ||
          metadata?.description?.toLowerCase().includes(searchLower) ||
          metadata?.category?.toLowerCase().includes(searchLower) ||
          metadata?.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      });
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(prompt => {
        const price = parseFloat(prompt.price || '0');
        switch (priceFilter) {
          case 'under1':
            return price < 1;
          case '1to5':
            return price >= 1 && price <= 5;
          case '5to10':
            return price >= 5 && price <= 10;
          case 'over10':
            return price > 10;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        case 'price-high':
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        case 'newest':
          return b.tokenId - a.tokenId;
        case 'oldest':
          return a.tokenId - b.tokenId;
        default:
          return 0;
      }
    });

    // Apply max items limit
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, sortBy, priceFilter, maxItems]);

  // Parse metadata helper
  const parseMetadata = (tokenURI: string) => {
    try {
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = tokenURI.replace('data:application/json;base64,', '');
        return JSON.parse(atob(base64Data));
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleRefresh = () => {
    fetchPrompts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110b30] to-[#1a0f3a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#835DED]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF7E5F]/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#835DED]/5 rounded-full filter blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto p-6">
        {/* Hero Header */}
        <div className="text-center mb-12 pt-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                <FaGem className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white font-Monserrat">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                  {title}
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Discover and trade unique AI prompts as NFTs in the decentralized marketplace
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full mb-6"></div>
            {prompts.length > 0 && (
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 bg-[#130f23] border border-[#835DED]/30 px-4 py-2 rounded-full">
                  <FaRocket className="text-[#835DED] text-sm" />
                  <span className="text-white font-medium">{prompts.length} Active Listings</span>
                </div>
                <div className="flex items-center space-x-2 bg-[#130f23] border border-[#FF7E5F]/30 px-4 py-2 rounded-full">
                  <FaStar className="text-[#FF7E5F] text-sm" />
                  <span className="text-white font-medium">Live Trading</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Card className="p-4 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <FaStore className="text-[#835DED] text-xl" />
                <div>
                  <p className="text-white font-semibold">Marketplace</p>
                  <p className="text-gray-400 text-sm">Browse & Trade</p>
                </div>
              </div>
            </Card>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-6 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <FaRedo className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                  <FaFilter className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-bold text-white">Smart Filters</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <Input
                  type="text"
                  placeholder="Search AI prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<FaSearch className="text-[#835DED]" />}
                  className="bg-[#1a0f3a] border-[#835DED]/30"
                  classNames={{
                    input: "text-white placeholder:text-gray-400",
                    inputWrapper: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 focus-within:border-[#835DED] transition-all duration-300",
                  }}
                />

                {/* Sort */}
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#1a0f3a]"
                  classNames={{
                    trigger: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 transition-all duration-300",
                    label: "text-gray-300",
                    value: "text-white",
                  }}
                >
                  <SelectItem key="newest" value="newest" className="text-white">
                    Newest First
                  </SelectItem>
                  <SelectItem key="oldest" value="oldest" className="text-white">
                    Oldest First
                  </SelectItem>
                  <SelectItem key="price-low" value="price-low" className="text-white">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem key="price-high" value="price-high" className="text-white">
                    Price: High to Low
                  </SelectItem>
                </Select>

                {/* Price Filter */}
                <Select
                  label="Price range"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-[#1a0f3a]"
                  classNames={{
                    trigger: "bg-[#1a0f3a] border border-[#835DED]/30 hover:border-[#835DED]/50 transition-all duration-300",
                    label: "text-gray-300",
                    value: "text-white",
                  }}
                >
                  <SelectItem key="all" value="all" className="text-white">
                    All Prices
                  </SelectItem>
                  <SelectItem key="under1" value="under1" className="text-white">
                    Under 1 ETH
                  </SelectItem>
                  <SelectItem key="1to5" value="1to5" className="text-white">
                    1-5 ETH
                  </SelectItem>
                  <SelectItem key="5to10" value="5to10" className="text-white">
                    5-10 ETH
                  </SelectItem>
                  <SelectItem key="over10" value="over10" className="text-white">
                    Over 10 ETH
                  </SelectItem>
                </Select>

                {/* Clear Filters */}
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('newest');
                    setPriceFilter('all');
                  }}
                  className="w-full border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                  variant="bordered"
                >
                  Clear Filters
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mb-6 animate-pulse">
                <FaGem className="text-white text-2xl" />
              </div>
              <Spinner size="lg" className="absolute inset-0" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading Marketplace</h3>
            <p className="text-gray-300">Fetching the latest AI prompts...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && prompts.length === 0 && (
          <div className="text-center py-20">
            <Card className="p-12 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                <FaStore className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Marketplace Awaits</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Be the first to mint and list a prompt on the marketplace!<br />
                Create unique AI prompts and start earning from your creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <FaRedo className="mr-2" />
                  Refresh Marketplace
                </Button>
                <Button
                  onClick={() => window.location.href = '/mint-nft'}
                  className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                  variant="bordered"
                >
                  <FaStar className="mr-2" />
                  Mint Your First NFT
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* No Results */}
        {!isLoading && prompts.length > 0 && filteredPrompts.length === 0 && (
          <div className="text-center py-20">
            <Card className="p-12 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We couldn't find any prompts matching your search criteria.<br />
                Try adjusting your filters or exploring different keywords.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('newest');
                  setPriceFilter('all');
                }}
                className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                variant="bordered"
              >
                Clear All Filters
              </Button>
            </Card>
          </div>
        )}

        {/* Prompts Grid */}
        {!isLoading && filteredPrompts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-white">Featured Prompts</h2>
                <div className="flex items-center space-x-2 bg-[#130f23] border border-[#835DED]/30 px-3 py-1 rounded-full">
                  <span className="text-[#835DED] font-medium">{filteredPrompts.length}</span>
                  <span className="text-gray-300 text-sm">results</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredPrompts.map((prompt, index) => (
                <div
                  key={prompt.tokenId}
                  className={`transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                      <PromptNFTCard
                        prompt={prompt}
                        onUpdate={() => handlePromptUpdate(prompt.tokenId)}
                        showOwnerActions={false}
                        purchasedPrompts={purchasedPrompts}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show More Button */}
        {maxItems && filteredPrompts.length >= maxItems && (
          <div className="text-center mt-12">
            <Card className="p-8 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Discover More Prompts</h3>
              <p className="text-gray-300 mb-6">
                Explore our complete collection of AI prompts and find the perfect ones for your projects.
              </p>
              <Button
                onClick={() => window.location.href = '/web3-marketplace'}
                className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                <FaStore className="mr-2" />
                View Full Marketplace
              </Button>
            </Card>
          </div>
        )}

        {/* Bottom CTA Section */}
        {!isLoading && filteredPrompts.length > 0 && (
          <div className="mt-20">
            <Card className="p-12 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h3>
                <p className="text-lg text-gray-300 mb-8">
                  Join thousands of creators who are already earning from their AI prompts. 
                  Mint your first NFT today and become part of the revolution.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.location.href = '/mint-nft'}
                    className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <FaStar className="mr-2" />
                    Mint Your NFT
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/my-nfts'}
                    className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                    variant="bordered"
                  >
                    <FaGem className="mr-2" />
                    View My Collection
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3Marketplace;
