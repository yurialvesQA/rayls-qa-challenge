require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/faucet");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {},
    localhost: {},
    rayls_devnet: {
      url: process.env.RPC_URL || "https://devnet-rpc.rayls.com",
      chainId: parseInt(process.env.CHAIN_ID || "123123", 10),
      accounts: process.env.PRIVATE_KEY_OWNER ? [process.env.PRIVATE_KEY_OWNER] : [],
    },
  },
};
