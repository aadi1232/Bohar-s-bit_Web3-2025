'use client';

import React from 'react';
import { Button } from '@nextui-org/react';
import { useWeb3 } from '@/components/Web3/Web3Provider';
import { FaWallet, FaExclamationTriangle } from 'react-icons/fa';
import { HiOutlineExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';

export const WalletConnection: React.FC = () => {
  const {
    isConnected,
    address,
    balance,
    isCorrectNetwork,
    isConnecting,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    return `${parseFloat(bal).toFixed(4)} ETH`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-end w-[280px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-end w-[280px]">
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-purple-600 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-700 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <FaWallet className="text-sm" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end w-[280px] relative">
      {/* Network Warning */}
      {!isCorrectNetwork && (
        <Button
          onClick={switchNetwork}
          className="bg-red-600 text-white font-semibold px-2 py-1 rounded-md hover:bg-red-700 transition-all duration-200 flex items-center space-x-1 mr-2 text-xs"
          size="sm"
        >
          <FaExclamationTriangle className="text-xs" />
          <span>Switch</span>
        </Button>
      )}

      {/* Wallet Info - Compact Design */}
      <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
        {/* Balance Display */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {balance ? formatBalance(balance) : '0.0000 ETH'}
            </span>
          </div>
          
          {/* Divider */}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Address Button */}
          <Button
            onClick={copyAddress}
            className="text-sm bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-md transition-all duration-200 flex items-center space-x-1 min-w-0"
            size="sm"
          >
            <span className="font-mono text-gray-700 dark:text-gray-300 text-xs">
              {formatAddress(address!)}
            </span>
            <HiOutlineExternalLink className="text-xs opacity-60" />
          </Button>
          
          {/* Divider */}
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Disconnect Button */}
          <Button
            onClick={disconnectWallet}
            className="text-xs bg-transparent hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-md transition-all duration-200 font-medium"
            size="sm"
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full mt-1 text-xs text-red-600 dark:text-red-400 max-w-xs truncate bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
