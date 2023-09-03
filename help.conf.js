const chainData = {
  4: {
    name: "sepolia",
    vrfCordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    keyHash: "",
    subID: 0,
    callbackgaslimit: 100000,
  },
  1337: {
    name: "localhost",
  },
}

const isDevelopmentChain = (name) => ["hardhat", "localhost"].includes(name)

module.exports = {
  isDevelopmentChain,
  chainData,
}
