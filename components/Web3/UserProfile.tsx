'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Spinner } from '@nextui-org/react';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { usePromptContract, PromptNFT } from '@/hooks/usePromptContract';
import { PromptNFTCard } from '@/components/Web3/PromptNFTCard';
import { FaUser, FaCoins, FaStore, FaRedo, FaWallet, FaGem, FaCrown, FaEthereum, FaEye, FaTag } from 'react-icons/fa';
import { styles } from '@/utils/styles';

export const UserProfile: React.FC = () => {
  const { address, isConnected, balance } = useWeb3();
  const { getPromptsByOwner, isLoading } = usePromptContract();
  const [ownedPrompts, setOwnedPrompts] = useState<PromptNFT[]>([]);
  const [listedPrompts, setListedPrompts] = useState<PromptNFT[]>([]);
  const [unlistedPrompts, setUnlistedPrompts] = useState<PromptNFT[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user's prompts
  const fetchUserPrompts = async () => {
    if (!address) return;

    setIsRefreshing(true);
    try {
      const prompts = await getPromptsByOwner(address);
      setOwnedPrompts(prompts);
      
      // Separate listed and unlisted prompts
      const listed = prompts.filter(p => p.isListed);
      const unlisted = prompts.filter(p => !p.isListed);
      
      setListedPrompts(listed);
      setUnlistedPrompts(unlisted);
    } catch (error) {
      console.error('Error fetching user prompts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isConnected && address) {
      fetchUserPrompts();
    }
  }, [isConnected, address]);

  const handleRefresh = () => {
    fetchUserPrompts();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                  <FaWallet className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white font-Monserrat">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                    My NFT Collection
                  </span>
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                Connect your wallet to view and manage your AI prompt NFTs
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full"></div>
            </div>
          </section>

          <Card className="p-12 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                <FaWallet className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Please connect your wallet to view your AI prompt NFTs and start managing your digital assets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                  Connect Wallet
                </Button>
                <Button
                  onClick={() => window.location.href = '/web3-marketplace'}
                  className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                  variant="bordered"
                >
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                  My NFT Collection
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Manage your AI prompt NFTs and showcase your digital creativity
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] mx-auto rounded-full mb-4"></div>
            <p className="text-sm text-gray-400 font-mono">
              {formatAddress(address!)}
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEthereum className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Wallet Balance</h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                  {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaGem className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Total NFTs</h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                  {ownedPrompts.length}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-[#130f23] border border-[#835DED]/20 hover:border-[#835DED]/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 animate-fade-in-up">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStore className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Listed for Sale</h3>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#835DED] to-[#FF7E5F]">
                  {listedPrompts.length}
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Action Bar */}
        <section className="mb-12">
          <Card className="p-6 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                  <FaCrown className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">NFT Dashboard</h3>
                  <p className="text-gray-300 text-sm">Manage your digital assets</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="bg-[#835DED]/20 text-[#835DED] border border-[#835DED]/40 hover:bg-[#835DED]/30 transition-all duration-300 hover:scale-105"
                  variant="bordered"
                >
                  <FaRedo className={`${isRefreshing ? 'animate-spin' : ''} mr-2`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <Button
                  onClick={() => window.location.href = '/mint-nft'}
                  className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <FaGem className="mr-2" />
                  Create NFT
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* NFT Collection Tabs */}
        <section>
          <Card className="bg-[#130f23] border border-[#835DED]/20">
            <CardBody>
              <Tabs
                aria-label="NFT Collection tabs"
                color="primary"
                variant="underlined"
                classNames={{
                  tabList: "gap-6 w-full relative rounded-none p-0 border-b border-[#835DED]/20",
                  cursor: "w-full bg-gradient-to-r from-[#835DED] to-[#FF7E5F]",
                  tab: "max-w-fit px-0 h-12",
                  tabContent: "group-data-[selected=true]:text-[#835DED] text-gray-300"
                }}
              >
                <Tab
                  key="all"
                  title={
                    <div className="flex items-center space-x-2">
                      <FaGem />
                      <span>All NFTs ({ownedPrompts.length})</span>
                    </div>
                  }
                >
                  <div className="py-6">
                    {isLoading ? (
                      <div className="flex flex-col justify-center items-center py-12">
                        <Spinner size="lg" color="secondary" />
                        <span className="ml-4 text-lg text-gray-300 mt-4">Loading your NFTs...</span>
                      </div>
                    ) : ownedPrompts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaGem className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">No NFTs Yet</h3>
                        <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                          You haven't minted any AI prompt NFTs yet. Start creating your first digital asset!
                        </p>
                        <Button
                          onClick={() => window.location.href = '/mint-nft'}
                          className="bg-gradient-to-r from-[#835DED] to-[#FF7E5F] text-white font-semibold rounded-full px-8 py-3 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                        >
                          <FaGem className="mr-2" />
                          Create Your First NFT
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ownedPrompts.map((prompt) => (
                          <PromptNFTCard
                            key={prompt.tokenId}
                            prompt={prompt}
                            onUpdate={fetchUserPrompts}
                            showOwnerActions={true}
                            purchasedPrompts={ownedPrompts.map(p => p.tokenId)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab
                  key="listed"
                  title={
                    <div className="flex items-center space-x-2">
                      <FaStore />
                      <span>Listed ({listedPrompts.length})</span>
                    </div>
                  }
                >
                  <div className="py-6">
                    {listedPrompts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaStore className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">No Listed NFTs</h3>
                        <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                          You haven't listed any prompts for sale yet. List your NFTs to start earning!
                        </p>
                        {unlistedPrompts.length > 0 && (
                          <p className="text-sm text-[#835DED] mb-4">
                            Go to the "Not Listed" tab to list your prompts for sale
                          </p>
                        )}
                        <Button
                          onClick={() => window.location.href = '/web3-marketplace'}
                          className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                          variant="bordered"
                        >
                          <FaEye className="mr-2" />
                          Browse Marketplace
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listedPrompts.map((prompt) => (
                          <PromptNFTCard
                            key={prompt.tokenId}
                            prompt={prompt}
                            onUpdate={fetchUserPrompts}
                            showOwnerActions={true}
                            purchasedPrompts={listedPrompts.map(p => p.tokenId)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Tab>

                <Tab
                  key="unlisted"
                  title={
                    <div className="flex items-center space-x-2">
                      <FaTag />
                      <span>Not Listed ({unlistedPrompts.length})</span>
                    </div>
                  }
                >
                  <div className="py-6">
                    {unlistedPrompts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center mx-auto mb-6">
                          <FaTag className="text-white text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">All NFTs Are Listed</h3>
                        <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                          All your prompt NFTs are currently listed for sale in the marketplace.
                        </p>
                        <Button
                          onClick={() => window.location.href = '/web3-marketplace'}
                          className="border-2 border-[#835DED] text-[#835DED] font-semibold rounded-full px-8 py-3 hover:bg-[#835DED] hover:text-white transition-all duration-300 hover:scale-105"
                          variant="bordered"
                        >
                          <FaEye className="mr-2" />
                          View in Marketplace
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Card className="mb-6 p-6 bg-gradient-to-r from-[#835DED]/10 to-[#FF7E5F]/10 border border-[#835DED]/30 backdrop-blur-sm">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#835DED] to-[#FF7E5F] rounded-full flex items-center justify-center">
                              <FaTag className="text-white text-lg" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg mb-2">Ready to List</h3>
                              <p className="text-sm text-gray-300">
                                These NFTs are not currently listed for sale. List them in the marketplace 
                                to start earning from your AI prompts.
                              </p>
                            </div>
                          </div>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {unlistedPrompts.map((prompt) => (
                            <PromptNFTCard
                              key={prompt.tokenId}
                              prompt={prompt}
                              onUpdate={fetchUserPrompts}
                              showOwnerActions={true}
                              purchasedPrompts={unlistedPrompts.map(p => p.tokenId)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
