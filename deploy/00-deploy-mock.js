const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config.js")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9
// link per gas calculated value based on the gas price of the chain.
// Chainlink Nodes pay the gas fees to give us randomness & do external execution
// So they price of requests change based on the price of gas

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks")
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args,
    })
    log("Mocks Deployed")
    log("----------------------------------------")
  }
}

module.exports.tags = ["all", "mocks"]
