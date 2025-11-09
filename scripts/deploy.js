const hre = require("hardhat");
const { ethers } = hre;

// Helper to convert numbers to wei
const tokens = (n) => ethers.utils.parseUnits(n.toString(), "ether");

// Helper to estimate ETH cost
async function estimateDeploymentCost(contractFactory, ...args) {
  const deployTx = contractFactory.getDeployTransaction(...args);
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const gasPrice = await ethers.provider.getGasPrice();
  const cost = estimatedGas.mul(gasPrice);
  console.log(`💰 Estimated deployment cost: ${ethers.utils.formatEther(cost)} ETH`);
}

async function main() {
  // Get accounts
  const [buyer, seller, inspector, lender] = await hre.ethers.getSigners();

  console.log("🟢 Accounts:");
  console.log("Buyer:", buyer.address);
  console.log("Seller:", seller.address);
  console.log("Inspector:", inspector.address);
  console.log("Lender:", lender.address);

  // 1️⃣ Deploy RealEstate contract
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  await estimateDeploymentCost(RealEstate); // Estimate cost
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();
  console.log(`✅ RealEstate deployed at: ${realEstate.address}`);

  // 2️⃣ Mint 3 properties
  console.log("🏠 Minting 3 properties...");
  for (let i = 0; i < 3; i++) {
    const tx = await realEstate
      .connect(seller)
      .mint(
        `https://ipfs.io/ipfs/QmYVmPA1Dzh27jgPjcGEj2rPEKwzPSuErWVDa8F2QP6L1Z/${i + 1}.json`
      );
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(tx.gasPrice || 0);
    console.log(`✅ Minted property #${i + 1} (Gas used: ${ethers.utils.formatEther(gasUsed)} ETH)`);
  }

  // 3️⃣ Deploy Escrow contract
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  await estimateDeploymentCost(Escrow, realEstate.address, seller.address, inspector.address, lender.address);
  const escrow = await Escrow.deploy(realEstate.address, seller.address, inspector.address, lender.address);
  await escrow.deployed();
  console.log(`✅ Escrow deployed at: ${escrow.address}`);

  // 4️⃣ Approve Escrow to manage NFTs
  console.log("🔑 Granting approval for Escrow to handle NFTs...");
  for (let i = 0; i < 3; i++) {
    const approveTx = await realEstate.connect(seller).approve(escrow.address, i + 1);
    const receipt = await approveTx.wait();
    const gasUsed = receipt.gasUsed.mul(approveTx.gasPrice || 0);
    console.log(`✅ Approved property #${i + 1} (Gas used: ${ethers.utils.formatEther(gasUsed)} ETH)`);
  }

  // 5️⃣ List properties for sale
  console.log("📄 Listing 3 properties...");
  for (let i = 0; i < 3; i++) {
    const tx = await escrow.connect(seller).list(
      i + 1,               // NFT ID
      buyer.address,       // Buyer address
      tokens(20),          // Purchase price
      tokens(10)           // Escrow amount
    );
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(tx.gasPrice || 0);
    console.log(`✅ Listed property #${i + 1} (Gas used: ${ethers.utils.formatEther(gasUsed)} ETH)`);
  }

  console.log("🎉 Deployment and setup complete!");
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
