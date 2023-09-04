const { network, ethers } = require("hardhat")
const { isDevelopmentChain, chainData } = require("../help.conf")

const FUMDING_AMOUNT = ethers.parseEther("1")
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  let vrfAddress, keyhash, subid, gassLimit

  if (isDevelopmentChain(network.name)) {
    const VRFMock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)

    vrfAddress = await VRFMock.getAddress()
    const subidTX = await VRFMock.createSubscription()
    // console.log(subidTX.value)
    const subREcipt = await subidTX.wait(1)

    subid = subREcipt.events[0].args.subid
    console.log(subid)

    // await VRFMock.fundSubscription(subid, FUMDING_AMOUNT)
  } else {
    vrfAddress = chainData[network.config.chainId]["vrfCordinator"]

    subid = chainData[network.config.chainId]["subID"]
  }
  keyhash = chainData[network.config.chainId]["keyHash"]
  gassLimit = chainData[network.config.chainId]["callbackgaslimit"]

  // const Lottery = await deploy("Lottery", {
  //   from: deployer,
  //   log: true,
  //   args: [vrfAddress, keyhash, subid, gassLimit],
  // })

  // if (isDevelopmentChain(network.name)) {
  //   const vrfCoordinatorV2Mock = await ethers.getContract(
  //     "VRFCoordinatorV2Mock"
  //   )
  //   await vrfCoordinatorV2Mock.addConsumer(subid, Lottery.address)
  // }
}
module.exports.tags = ["all", "lottery"]
