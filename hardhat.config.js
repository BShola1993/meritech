require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // Optional: Sepolia
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      // accounts: ["QN_db8b2a9560224b8ea7f1ca2087d51107"],
     },
  },
};
