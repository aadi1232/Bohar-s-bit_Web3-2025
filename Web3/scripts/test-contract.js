const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log("Testing PromptMarketplace contract at:", contractAddress);
  
  // Get contract instance
  const PromptMarketplace = await ethers.getContractFactory("PromptMarketplace");
  const marketplace = PromptMarketplace.attach(contractAddress);
  
  try {
    // Test basic contract functions
    const name = await marketplace.name();
    const symbol = await marketplace.symbol();
    const owner = await marketplace.owner();
    const paused = await marketplace.paused();
    
    console.log("Contract Name:", name);
    console.log("Contract Symbol:", symbol);
    console.log("Contract Owner:", owner);
    console.log("Contract Paused:", paused);
    
    // Test getting all prompts (should be empty initially)
    const allPrompts = await marketplace.getAllPrompts();
    console.log("Total Prompts:", allPrompts.length);
    
    // Test getting listed prompts
    const listedPrompts = await marketplace.getAllListedPrompts();
    console.log("Listed Prompts:", listedPrompts.length);
    
    console.log("\n✅ Contract is working correctly!");
    
  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
