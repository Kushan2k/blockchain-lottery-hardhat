const { ethers, getNamedAccounts, network } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const Lottery = await ethers.getContract("Lottery", deployer)

  const intervel = (await Lottery.i_time_interval()).toString()

  await network.provider.send("evm_increaseTime", [parseInt(intervel) + 1])
  await network.provider.send("evm_mine", [])

  try {
    const tx = await Lottery.pickWinner()
    const recipt = tx.wait(1)

    const reqid = recipt.logs[1].args[0]
    const address = await Lottery.getAddress()

    const VRF = await ethers.getContract("VRFCoordinatorV2Mock")

    await VRF.fulfillRandomWords(reqid, address)

    console.log("Winner Picked!....")
  } catch (er) {
    console.log(er.message)
  }
}

main().catch((er) => {
  console.error(er)
  process.exit(1)
})
