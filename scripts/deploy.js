const hre = require("hardhat");
const tokens = (n)=>{
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts
  const [buyer, seller, inspector, lender] = await hre.ethers.getSigners();

  // Deploy Real Estate
  const RealEstate = await hre.ethers.getContractFactory("RealEstate");
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();
  console.log(`✅ RealEstate contract deployed at: ${realEstate.address}`);

  console.log(`🏠 Minting 3 properties...\n`);
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate
      .connect(seller)
      .mint(
          `https://ipfs.io/ipfs/QmYVmPA1Dzh27jgPjcGEj2rPEKwzPSuErWVDa8F2QP6L1Z/${i + 1}.json`

      );
    await transaction.wait();
  }

  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.deployed();
  console.log(`✅ Escrow contract deployed at: ${escrow.address}`);

  // ✅ Approve Escrow to transfer NFTs
  console.log(`🔑 Granting approval for Escrow to handle NFTs...\n`);
  for (let i = 0; i < 3; i++) {
    const approveTx = await realEstate
      .connect(seller)
      .approve(escrow.address, i + 1);
    await approveTx.wait();
  }

  // ✅ List the properties
  console.log(`📄 Listing 3 properties...\n`);
  for (let i = 0; i < 3; i++) {
    const tx = await escrow
      .connect(seller)
      .list(
        i + 1,
        buyer.address,
        hre.ethers.utils.parseUnits("20", "ether"),
        hre.ethers.utils.parseUnits("10", "ether")
      );
    await tx.wait();
  }

  console.log("🎉 Deployment and setup complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
