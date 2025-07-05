# Web3 Integration for AI Prompt Marketplace

This project now includes full Web3 functionality that allows users to mint, buy, and sell AI prompts as NFTs on the blockchain alongside the existing Web2 features.

## 🚀 Features

### Smart Contract Features
- **NFT Minting**: Transform AI prompts into unique NFTs with metadata
- **Marketplace Trading**: List and purchase NFTs with ETH payments
- **Royalty System**: Original creators earn royalties from every resale (0-10%)
- **Ownership Verification**: Blockchain-based proof of prompt ownership
- **Gas Optimized**: Efficient contract design for lower transaction costs

### Frontend Features
- **Wallet Integration**: MetaMask connection with auto-reconnect
- **Seamless UX**: Smooth integration between Web2 and Web3 features
- **Real-time Updates**: Live marketplace data with automatic refresh
- **Mobile Responsive**: Full mobile support for wallet operations
- **Error Handling**: Comprehensive error messages and transaction feedback

## 🛠 Tech Stack

- **Smart Contracts**: Solidity, OpenZeppelin, Hardhat
- **Frontend**: Next.js, TypeScript, Ethers.js
- **UI Components**: NextUI, Tailwind CSS
- **State Management**: React Context API
- **Notifications**: React Hot Toast

## 📦 Setup Instructions

### 1. Smart Contract Deployment

```bash
# Navigate to Web3 directory
cd Web3

# Install dependencies
npm install

# Start local Hardhat network (keep this running)
npx hardhat node

# Deploy contract (in another terminal)
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Frontend Configuration

The contract is already configured in `lib/contractConfig.ts` with the deployed address:
- Contract Address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Network: Hardhat Localhost (Chain ID: 31337)
- RPC URL: `http://127.0.0.1:8545`

### 3. MetaMask Setup

1. Install MetaMask browser extension
2. Add Hardhat network to MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
3. Import test accounts (private keys available in Hardhat console)

### 4. Run the Application

```bash
# Start the Next.js development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Key Components

### Web3Provider (`components/Web3/Web3Provider.tsx`)
- Manages wallet connection state
- Handles network switching
- Provides Web3 context to the entire app
- Auto-reconnects on page reload

### usePromptContract Hook (`hooks/usePromptContract.ts`)
- Encapsulates all smart contract interactions
- Provides typed interfaces for contract methods
- Handles transaction loading states and errors
- Includes helper functions for data fetching

### Smart Contract (`Web3/contracts/PromptMarketplace.sol`)
- ERC721 NFT implementation with URI storage
- ERC2981 royalty standard support
- Secure marketplace with reentrancy protection
- Owner-controlled pause functionality

## 📱 User Flows

### Minting a Prompt NFT
1. User connects MetaMask wallet
2. Navigates to "Mint NFT" page
3. Fills out prompt details and sets royalty percentage
4. Confirms transaction in MetaMask
5. NFT is minted and appears in user's profile

### Listing for Sale
1. User goes to "My NFTs" page
2. Clicks "List for Sale" on an owned NFT
3. Sets price in ETH
4. Confirms transaction to approve and list
5. NFT appears in marketplace

### Purchasing an NFT
1. User browses Web3 marketplace
2. Clicks "Buy" on a listed NFT
3. Confirms purchase transaction
4. NFT ownership transfers with automatic royalty distribution

## 🛡 Security Features

- **Reentrancy Protection**: Guards against reentrancy attacks
- **Input Validation**: Comprehensive validation on all inputs
- **Access Control**: Owner-only functions for contract management
- **Pause Functionality**: Emergency pause capability
- **Royalty Limits**: Maximum 10% royalty to prevent exploitation

## 📊 Testing

### Contract Testing
```bash
cd Web3
npx hardhat run scripts/test-contract.js --network localhost
```

### Frontend Testing
The application includes comprehensive error handling and loading states for all Web3 operations.

## 🌐 Navigation

The application includes new pages accessible through the main navigation:

- **Web3 Market**: Browse and purchase NFT prompts
- **Mint NFT**: Create new prompt NFTs
- **My NFTs**: Manage owned NFTs and listings
- **Marketplace**: Combined Web2/Web3 marketplace with tabs

## 💡 Usage Tips

1. **Network Connection**: Ensure MetaMask is connected to the Hardhat network
2. **Gas Fees**: Transactions require ETH for gas fees (free on local network)
3. **Metadata**: Prompt metadata is stored as base64-encoded JSON for simplicity
4. **Royalties**: Set royalty percentages carefully as they can't be changed after minting
5. **Listings**: Listed NFTs can be unlisted by the owner at any time

## 🔮 Future Enhancements

- **IPFS Integration**: Store metadata on IPFS for true decentralization
- **Multi-chain Support**: Deploy on multiple blockchain networks
- **Advanced Filtering**: Enhanced marketplace filtering and search
- **Bulk Operations**: Mint and manage multiple NFTs at once
- **Auction System**: Time-based auctions for premium prompts
- **Social Features**: User profiles, ratings, and reviews for NFT creators

## 📞 Support

For issues with the Web3 integration:

1. Check that Hardhat network is running
2. Verify MetaMask is connected to the correct network
3. Ensure you have test ETH in your wallet
4. Check browser console for detailed error messages

## 🔗 Contract Verification

The deployed contract can be verified using:

```bash
# Contract Address
0x5FbDB2315678afecb367f032d93F642f64180aa3

# Contract ABI and source available in:
Web3/artifacts/contracts/PromptMarketplace.sol/
```

---

The Web3 integration is now fully functional and ready for use! Users can seamlessly transition between traditional prompt purchases and NFT-based ownership, creating a hybrid marketplace that serves both Web2 and Web3 users.
