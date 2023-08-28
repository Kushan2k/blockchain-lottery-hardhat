require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("dotenv").config()
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
}
