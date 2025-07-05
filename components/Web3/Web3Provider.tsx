'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, NETWORK_CONFIG } from '@/lib/contractConfig';

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  
  // Loading states
  isConnecting: boolean;
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Connection functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  
  // Provider and signer
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  const isCorrectNetwork = chainId === CONTRACT_CONFIG.chainId;

  // Check if MetaMask is installed
  const checkMetaMask = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return true;
    }
    setError('MetaMask is not installed. Please install MetaMask to continue.');
    return false;
  };

  // Connect to wallet
  const connectWallet = async () => {
    if (!checkMetaMask()) return;

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setBalance(ethers.formatEther(balance));
        setChainId(Number(network.chainId));
        setIsConnected(true);

        // Store connection state
        localStorage.setItem('web3Connected', 'true');
        localStorage.setItem('connectedAddress', address);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setBalance(null);
    setChainId(null);
    setIsConnected(false);
    setError(null);

    // Clear storage
    localStorage.removeItem('web3Connected');
    localStorage.removeItem('connectedAddress');
  };

  // Switch to correct network
  const switchNetwork = async () => {
    if (!checkMetaMask()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}`,
                chainName: NETWORK_CONFIG.chainName,
                nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                rpcUrls: NETWORK_CONFIG.rpcUrls,
                blockExplorerUrls: NETWORK_CONFIG.blockExplorerUrls,
              },
            ],
          });
        } catch (addError: any) {
          setError('Failed to add network to MetaMask');
          console.error('Add network error:', addError);
        }
      } else {
        setError('Failed to switch network');
        console.error('Switch network error:', switchError);
      }
    }
  };

  // Update balance
  const updateBalance = async () => {
    if (provider && address) {
      try {
        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        console.error('Failed to update balance:', err);
      }
    }
  };

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined') return;

      const wasConnected = localStorage.getItem('web3Connected');
      const savedAddress = localStorage.getItem('connectedAddress');

      if (wasConnected && savedAddress && window.ethereum) {
        setIsLoading(true);
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_accounts', []);
          
          if (accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setBalance(ethers.formatEther(balance));
            setChainId(Number(network.chainId));
            setIsConnected(true);
          } else {
            // Clear stored state if accounts don't match
            localStorage.removeItem('web3Connected');
            localStorage.removeItem('connectedAddress');
          }
        } catch (err) {
          console.error('Auto-connect error:', err);
          localStorage.removeItem('web3Connected');
          localStorage.removeItem('connectedAddress');
        } finally {
          setIsLoading(false);
        }
      }
    };

    autoConnect();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // Account changed, reconnect
          connectWallet();
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(parseInt(chainId, 16));
        // Reload the page to avoid stale state
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [address]);

  // Update balance periodically
  useEffect(() => {
    if (isConnected && address) {
      updateBalance();
      const interval = setInterval(updateBalance, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isConnected, address, provider]);

  const contextValue: Web3ContextType = {
    isConnected,
    address,
    balance,
    chainId,
    isCorrectNetwork,
    isConnecting,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    provider,
    signer,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// MetaMask window extension
declare global {
  interface Window {
    ethereum?: any;
  }
}
