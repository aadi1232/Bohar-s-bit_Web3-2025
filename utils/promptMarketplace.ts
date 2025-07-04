import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import PromptMarketplaceABI from "../contracts/PromptMarketplaceABI.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROMPT_MARKETPLACE_ADDRESS || process.env.REACT_APP_PROMPT_MARKETPLACE_ADDRESS;

// Use ethers.Contract with either a Signer or any Provider (ethers v6)
export function getPromptMarketplaceContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS as string, PromptMarketplaceABI, signerOrProvider);
}

// Example usage: Place this in your Header or main navigation
// <ConnectButton />