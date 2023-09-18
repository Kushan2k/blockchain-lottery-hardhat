const { deployments, getNamedAccounts, network, ethers } = require("hardhat")
const { isDevelopmentChain } = require("../help.conf")
const { expect, assert } = require("chai")

if (!isDevelopmentChain(network.name)) {
  describe.skip
}

describe("Testing Lottery", () => {
  let Lottery, deployer, tester, interval

  beforeEach(async () => {
    await deployments.fixture(["all"])

    deployer = (await getNamedAccounts()).deployer
    tester = (await getNamedAccounts()).tester

    Lottery = await ethers.getContract("Lottery", deployer)
    interval = await Lottery.i_time_interval()
  })

  //testing the initial state of the contract
  describe("Deployments", () => {
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
  describe("Testing the entries", () => {
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
  describe("Calculating lottery", () => {
    beforeEach(async () => {
      const accounts = await ethers.getSigners()
      const fees = ethers.parseEther("0.01")
      for (let i = 1; i < accounts.length; i++) {
        let l = Lottery.connect(accounts[i])
        await l.enter({ value: fees })
        // console.log(
        //   `account ${accounts[i].address} / balance ${ethers.formatEther(
        //     await ethers.provider.getBalance(accounts[i])
        //   )}`
        // )
      }
    })

    it("end before the time interval", async () => {
      await expect(Lottery.pickWinner()).to.be.revertedWith("Not enough time")
    })

    it("confirm entries", async () => {
      const entires = await Lottery.getarr()

      assert.equal(entires.toString(), "19")
    })

    it("when lottery is picking winner state is calculating", async () => {
      await network.provider.send("evm_increaseTime", [parseInt(interval) + 1])
      await network.provider.send("evm_mine", [])

      await Lottery.pickWinner()

      const state = await Lottery.getState()

      assert.equal(state, "2")
    })

    it("pick winner/reset entires/contact balance is 0", async () => {
      await network.provider.send("evm_increaseTime", [parseInt(interval) + 1])
      await network.provider.send("evm_mine", [])

      const tx = await Lottery.pickWinner()
      const recept = await tx.wait(1)

      const reqid = recept.logs[1].args[0].toString()

      const VRF = await ethers.getContract("VRFCoordinatorV2Mock")
      const address = await Lottery.getAddress()

      await new Promise((resolve, reject) => {
        Lottery.once("WinnerSelected", async function () {
          const entires = await Lottery.getarr()
          const winner = await Lottery.getLatestWinner()
          const netstate = await Lottery.getState()
          const contractBalance = await ethers.provider.getBalance(address)

          const prevWiners = await Lottery.getLatestWinner()

          //random number generated
          const randomword = await Lottery.s_randomWord()

          assert(prevWiners > 0)
          assert.equal(netstate.toString(), "0")
          assert.equal(entires.toString(), "0")
          assert.equal(contractBalance.toString(), "0")

          const nb = await ethers.provider.getBalance(winner)

          console.log(
            `winner is ${winner} /new balance ${ethers.formatEther(nb)}`
          )

          resolve()
        })
        VRF.fulfillRandomWords(reqid, address)
      })
    })
  })
})
