const { network, ethers } = require("hardhat")
const { isDevelopmentChain } = require("../help.conf")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts()
  if (isDevelopmentChain(network.name)) {
    await deployments.fixture(["all"])
  }
  console.log("Updating Frontend data")

  const Lottery = await ethers.getContract("Lottery", deployer)
  const lottery_address = await Lottery.getAddress()

  const address = JSON.parse(
    fs.readFileSync(
      "./blockchain-lottery-frontend-react/src/constants/address.json",
      "utf8"
    )
  )

  if (network.config.chainId.toString() in address) {
    if (!address[network.config.chainId.toString()]) {
      address[network.config.chainId.toString()].push(lottery_address)
    }
  } else {
    address[network.config.chainId.toString()] = [lottery_address]
  }

  fs.writeFileSync(
    "./blockchain-lottery-frontend-react/src/constants/address.json",
    JSON.stringify(address)
  )

  fs.writeFileSync(
    "./blockchain-lottery-frontend-react/src/constants/abi.json",
    Lottery.interface.formatJson()
  )
}

module.exports.tags = ["frontend"]
