const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const { isDevelopmentChain } = require("../help.conf")
const { expect, assert } = require("chai")

if (!isDevelopmentChain(network.name)) {
  describe.skip
}

describe("Testing Lottery", async () => {
  let Lottery, deployer, tester

  beforeEach(async () => {
    await deployments.fixture(["all"])

    deployer = (await getNamedAccounts()).deployer
    tester = (await getNamedAccounts()).tester

    Lottery = await ethers.getContract("Lottery", deployer)
  })

  //testing the initial state of the contract
  describe("Deployments", async () => {
    it("deployed", async () => {
      const Lottery_address = await Lottery.getAddress()
      const balance = await ethers.provider.getBalance(Lottery_address)

      expect(balance.toString()).to.equal("0")
    })
    it("lottery shoud be in active state", async () => {
      const state = await Lottery.getState()

      assert.equal(state.toString(), "0")
    })

    it("check owner of the lotter", async () => {
      const onwer = await Lottery.getOwner()

      assert.equal(onwer, deployer)
    })
    it("check entrance fees", async () => {
      const fees = await Lottery.getEntraceFee()

      const expectFees = ethers.parseEther("0.01")

      expect(fees).to.equal(expectFees)
    })
    it("there can not be any entires", async () => {
      const expectvalue = "0"

      const entries = await Lottery.getarr()

      assert.equal(entries, expectvalue)
    })
    it("shoud revent if call get winner function", async () => {
      await expect(Lottery.getLatestWinner()).to.be.revertedWith(
        "No any previous winners"
      )
    })
    it("check time interval", async () => {
      const intervel = await Lottery.i_time_interval()
      const ex = "100000"

      expect(intervel.toString()).to.equal(ex)
    })
  })

  //test the entrance of the lottery
  describe("Testing the entries", async () => {
    it("can not enter without payment", async () => {
      await expect(Lottery.enter()).to.be.reverted
    })

    it("can enter with the payment completed", async () => {
      const fee = ethers.parseEther("0.01")
      await Lottery.enter({ value: fee })

      const entry = await Lottery.s_enties(0)

      expect(entry).to.be.equal(deployer)
    })

    it("can enter different users", async () => {
      const singers = await ethers.getSigners()
      const fee = ethers.parseEther("0.01")
      let l, i
      for (i = 1; i < singers.length; i++) {
        l = await Lottery.connect(singers[i])
        await Lottery.enter({ value: fee })
      }

      const entires = await Lottery.getarr()

      assert.equal(entires.toString(), singers.length - 1)
    })
  })

  //lottery end
  describe("Calculating lottery", async () => {
    it("end before the time interval", async () => {
      await expect(Lottery.pickWinner()).to.be.revertedWith("Not enough time")
    })
  })
})
