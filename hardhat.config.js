require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("dotenv").config()
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")

const SEPOLIA_ACCOUNT_1 = process.env.PRIVATE_KEY_ACCOUNT_1
const SEPOLIA_ACCOUNT_2 = process.env.PRIVATE_KEY_ACCOUNT_2

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "",
      accounts: [SEPOLIA_ACCOUNT_1, SEPOLIA_ACCOUNT_2],
    },
    hardhat: {
      chainId: 1337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
  },
}
