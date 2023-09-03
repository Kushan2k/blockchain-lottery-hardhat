const chainData = {
  4: {
    name: "sepolia",
    vrfCordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subID: 4822,
    callbackgaslimit: 300000,
  },
  1337: {
    name: "localhost",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackgaslimit: 300000,
  },
}

const isDevelopmentChain = (name) => ["hardhat", "localhost"].includes(name)

module.exports = {
  isDevelopmentChain,
  chainData,
}
