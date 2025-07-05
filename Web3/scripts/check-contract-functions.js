const { ethers } = require("hardhat");

async function main() {
    // Contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    // Get the contract
    const PromptMarketplace = await ethers.getContractFactory("PromptMarketplace");
    const contract = PromptMarketplace.attach(contractAddress);
    
    console.log("Contract address:", contractAddress);
    
    // Test the getPromptsByOwner function
    const [owner, addr1, addr2] = await ethers.getSigners();
    console.log("Testing getPromptsByOwner function:");
    console.log("Owner address:", owner.address);
    
    try {
        // Check current token count
        const currentTokenId = await contract.getCurrentTokenId();
        console.log("Current token ID:", currentTokenId.toString());
        
        // Test minting a prompt first
        console.log("\nMinting a test prompt...");
        const tokenURI = "data:application/json;base64," + Buffer.from(JSON.stringify({
            name: "Test Prompt",
            description: "A test prompt for debugging",
            prompt: "Write a story about a magical forest"
        })).toString('base64');
        
        const tx = await contract.mintPrompt(tokenURI, 250); // 2.5% royalty
        await tx.wait();
        console.log("Prompt minted successfully");
        
        // Check new token count
        const newTokenId = await contract.getCurrentTokenId();
        console.log("New token ID:", newTokenId.toString());
        
        // Now test getPromptsByOwner
        const ownedPrompts = await contract.getPromptsByOwner(owner.address);
        console.log("Owned prompts:", ownedPrompts.map(id => id.toString()));
        
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Full error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
