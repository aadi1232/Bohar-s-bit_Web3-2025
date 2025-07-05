'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Tabs, Tab, Spinner } from '@nextui-org/react';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { usePromptContract, PromptNFT } from '@/hooks/usePromptContract';
import { PromptNFTCard } from '@/components/Web3/PromptNFTCard';
import { FaUser, FaCoins, FaStore, FaRedo } from 'react-icons/fa';

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
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="text-center py-12">
          <CardBody>
            <FaUser className="text-gray-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please connect your wallet to view your AI prompt NFTs
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 font-mono">
                  {formatAddress(address!)}
                </p>
              </div>
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
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Balance */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FaCoins className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                <p className="font-semibold text-lg">
                  {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                </p>
              </div>
            </div>

            {/* Total NFTs */}
            <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FaUser className="text-green-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total NFTs</p>
                <p className="font-semibold text-lg">{ownedPrompts.length}</p>
              </div>
            </div>

            {/* Listed for Sale */}
            <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <FaStore className="text-purple-600 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Listed for Sale</p>
                <p className="font-semibold text-lg">{listedPrompts.length}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs for Different Views */}
      <Card>
        <CardBody>
          <Tabs
            aria-label="Profile tabs"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#22d3ee]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#06b6d4]"
            }}
          >
            <Tab
              key="all"
              title={
                <div className="flex items-center space-x-2">
                  <FaUser />
                  <span>All NFTs ({ownedPrompts.length})</span>
                </div>
              }
            >
              <div className="py-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                    <span className="ml-4 text-lg">Loading your prompts...</span>
                  </div>
                ) : ownedPrompts.length === 0 ? (
                  <div className="text-center py-12">
                    <FaUser className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't minted any AI prompt NFTs yet
                    </p>
                    <Button
                      onClick={() => window.location.href = '/create-shop'}
                      color="primary"
                    >
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
                    <FaStore className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Listed NFTs</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't listed any prompts for sale yet
                    </p>
                    {unlistedPrompts.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Go to the "Not Listed" tab to list your prompts for sale
                      </p>
                    )}
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
                  <FaCoins />
                  <span>Not Listed ({unlistedPrompts.length})</span>
                </div>
              }
            >
              <div className="py-6">
                {unlistedPrompts.length === 0 ? (
                  <div className="text-center py-12">
                    <FaCoins className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">All NFTs Are Listed</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      All your prompt NFTs are currently listed for sale
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                        Ready to List
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        These NFTs are not currently listed for sale. You can list them in the marketplace 
                        to start earning from your AI prompts.
                      </p>
                    </div>
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
    </div>
  );
};

export default UserProfile;
