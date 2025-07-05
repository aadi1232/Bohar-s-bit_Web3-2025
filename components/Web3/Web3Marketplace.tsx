'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Select, SelectItem, Button, Spinner } from '@nextui-org/react';
import { usePromptContract, PromptNFT } from '@/hooks/usePromptContract';
import { PromptNFTCard } from '@/components/Web3/PromptNFTCard';
import { FaSearch, FaStore, FaFilter, FaRedo } from 'react-icons/fa';

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
  const { getAllListedPrompts, isLoading } = usePromptContract();
  const [prompts, setPrompts] = useState<PromptNFT[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<PromptNFT[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="w-full max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaStore className="text-blue-600 text-2xl" />
          <h1 className="text-3xl font-bold">{title}</h1>
          {prompts.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {prompts.length} listed
            </span>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="flat"
          className="flex items-center space-x-2"
        >
          <FaRedo className={`${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <Input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<FaSearch className="text-gray-400" />}
                variant="bordered"
              />

              {/* Sort */}
              <Select
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                variant="bordered"
              >
                <SelectItem key="newest" value="newest">
                  Newest First
                </SelectItem>
                <SelectItem key="oldest" value="oldest">
                  Oldest First
                </SelectItem>
                <SelectItem key="price-low" value="price-low">
                  Price: Low to High
                </SelectItem>
                <SelectItem key="price-high" value="price-high">
                  Price: High to Low
                </SelectItem>
              </Select>

              {/* Price Filter */}
              <Select
                label="Price range"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                variant="bordered"
              >
                <SelectItem key="all" value="all">
                  All Prices
                </SelectItem>
                <SelectItem key="under1" value="under1">
                  Under 1 ETH
                </SelectItem>
                <SelectItem key="1to5" value="1to5">
                  1-5 ETH
                </SelectItem>
                <SelectItem key="5to10" value="5to10">
                  5-10 ETH
                </SelectItem>
                <SelectItem key="over10" value="over10">
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
                variant="flat"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
          <span className="ml-4 text-lg">Loading prompts...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && prompts.length === 0 && (
        <div className="text-center py-12">
          <FaStore className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No prompts available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Be the first to mint and list a prompt on the marketplace!
          </p>
          <Button
            onClick={handleRefresh}
            color="primary"
            className="flex items-center space-x-2"
          >
            <FaRedo />
            <span>Refresh</span>
          </Button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && prompts.length > 0 && filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <FaSearch className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setSortBy('newest');
              setPriceFilter('all');
            }}
            variant="flat"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Prompts Grid */}
      {!isLoading && filteredPrompts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptNFTCard
              key={prompt.tokenId}
              prompt={prompt}
              onUpdate={fetchPrompts}
              showOwnerActions={false}
            />
          ))}
        </div>
      )}

      {/* Show More Button */}
      {maxItems && filteredPrompts.length >= maxItems && (
        <div className="text-center mt-8">
          <Button
            onClick={() => window.location.href = '/marketplace'}
            color="primary"
            variant="flat"
          >
            View All Prompts
          </Button>
        </div>
      )}
    </div>
  );
};

export default Web3Marketplace;
