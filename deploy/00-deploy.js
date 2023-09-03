const { chainData, isDevelopmentChain } = require("../help.conf")
const { network, ethers } = require("hardhat")
const BASE_FEE = ethers.parseEther("0.25")
const GAS_PRICE_LINK = 1e9

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  if (isDevelopmentChain(network.name)) {
    console.log("Development network detected, deploying mocks.....")

    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    })

    // const LinkToken = await deploy("LinkTokenInterface", {
    //   from: deployer,
    //   log: true,
    //   args: [],
    // })
  }
}

module.exports.tags = ["all", "mocks"]
