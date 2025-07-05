import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PromptMarketplace contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  // Deploy the contract
  const PromptMarketplace = await ethers.getContractFactory("PromptMarketplace");
  const marketplace = await PromptMarketplace.deploy(deployer.address);

  await marketplace.waitForDeployment();
  const contractAddress = await marketplace.getAddress();

  console.log("PromptMarketplace deployed to:", contractAddress);
  console.log("Contract owner:", await marketplace.owner());
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    deployer: deployer.address,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString()
  };

  console.log("Deployment Info:", deploymentInfo);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
