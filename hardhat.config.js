require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("dotenv").config()
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")

const SEPOLIA_ACCOUNT_1 = process.env.PRIVATE_KEY_ACCOUNT_1
const SEPOLIA_ACCOUNT_2 = process.env.PRIVATE_KEY_ACCOUNT_2
const INFURA_API_KEY = process.env.INFURA_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_ACCOUNT_1, SEPOLIA_ACCOUNT_2],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 1337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    tester: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    noColors: true,
    outputFile: "gas report.txt",
  },
  mocha: {
    timeout: 10000,
  },
}
