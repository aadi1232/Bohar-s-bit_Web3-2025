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
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <FaWallet className="text-sm" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Network Warning */}
      {!isCorrectNetwork && (
        <Button
          onClick={switchNetwork}
          className="bg-red-600 text-white font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
          size="sm"
        >
          <FaExclamationTriangle className="text-sm" />
          <span>Switch Network</span>
        </Button>
      )}

      {/* Wallet Info */}
      <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
        {/* Balance */}
        <div className="text-sm">
          <div className="font-semibold text-gray-900 dark:text-white">
            {balance ? formatBalance(balance) : '0.0000 ETH'}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={copyAddress}
            className="text-sm bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-200 flex items-center space-x-1"
            size="sm"
          >
            <span className="font-mono text-gray-700 dark:text-gray-300">
              {formatAddress(address!)}
            </span>
            <HiOutlineExternalLink className="text-xs" />
          </Button>
        </div>

        {/* Disconnect */}
        <Button
          onClick={disconnectWallet}
          className="text-sm bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 px-3 py-2 rounded-md transition-all duration-200"
          size="sm"
        >
          Disconnect
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
