const { ethers } = require("hardhat");

async function main() {
  const [deployer, buyer] = await ethers.getSigners();
  
  console.log("Deployer address:", deployer.address);
  console.log("Buyer address:", buyer.address);
  
  // Get the contract instance
  const PromptMarketplace = await ethers.getContractFactory("PromptMarketplace");
  const contract = PromptMarketplace.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  
  try {
    // Check current state
    const allPrompts = await contract.getAllPrompts();
    console.log("All prompts:", allPrompts.map(id => id.toString()));
    
    // Get all listed prompts
    const listedPrompts = await contract.getAllListedPrompts();
    console.log("Listed prompts:", listedPrompts.map(id => id.toString()));
    
    if (listedPrompts.length === 0) {
      console.log("No prompts listed. Let's mint and list one for testing.");
      
      // Mint a prompt
      const mintTx = await contract.connect(deployer).mintPrompt(
        "data:application/json;base64,eyJuYW1lIjoiVGVzdCBQcm9tcHQiLCJkZXNjcmlwdGlvbiI6IkEgdGVzdCBwcm9tcHQgZm9yIGRlYnVnZ2luZyIsInByb21wdCI6IlRlc3QgcHJvbXB0IGNvbnRlbnQiLCJjYXRlZ29yeSI6InRlc3QiLCJ0YWdzIjpbInRlc3QiXX0=",
        500 // 5% royalty
      );
      await mintTx.wait();
      console.log("Prompt minted successfully");
      
      // List the prompt
      const listTx = await contract.connect(deployer).listPrompt(
        1, 
        ethers.parseEther("0.1")
      );
      await listTx.wait();
      console.log("Prompt listed successfully");
    }
    
    // Check the first listed prompt
    const tokenId = listedPrompts.length > 0 ? listedPrompts[0] : 1;
    console.log("Checking token ID:", tokenId.toString());
    
    // Get listing details
    const [seller, price, isListed] = await contract.getListing(tokenId);
    console.log("Listing details:");
    console.log("  Seller:", seller);
    console.log("  Price:", ethers.formatEther(price), "ETH");
    console.log("  Is listed:", isListed);
    
    // Get token owner
    const owner = await contract.ownerOf(tokenId);
    console.log("Token owner:", owner);
    
    // Check if token exists
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("Token URI exists:", tokenURI ? "Yes" : "No");
    
    // Check contract approval
    const approved = await contract.getApproved(tokenId);
    console.log("Approved address:", approved);
    
    // Check buyer balance
    const buyerBalance = await ethers.provider.getBalance(buyer.address);
    console.log("Buyer balance:", ethers.formatEther(buyerBalance), "ETH");
    
    if (isListed && price > 0) {
      console.log("\nAttempting to buy prompt...");
      
      // Try to estimate gas first
      try {
        const gasEstimate = await contract.connect(buyer).buyPrompt.estimateGas(tokenId, { value: price });
        console.log("Gas estimate:", gasEstimate.toString());
        
        // Try to buy
        const buyTx = await contract.connect(buyer).buyPrompt(tokenId, { value: price });
        await buyTx.wait();
        console.log("Purchase successful!");
        
      } catch (error) {
        console.error("Error during purchase:", error.message);
        
        // Check specific conditions
        if (seller.toLowerCase() === buyer.address.toLowerCase()) {
          console.log("ERROR: Buyer cannot buy their own NFT");
        }
        
        if (buyerBalance < price) {
          console.log("ERROR: Insufficient balance");
        }
        
        if (!isListed) {
          console.log("ERROR: Token not listed");
        }
        
        if (owner.toLowerCase() !== seller.toLowerCase()) {
          console.log("ERROR: Seller is not the owner");
        }
        
        if (approved.toLowerCase() !== contract.target.toLowerCase()) {
          console.log("ERROR: Contract not approved to transfer token");
        }
      }
    } else {
      console.log("No valid listing found for testing");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
