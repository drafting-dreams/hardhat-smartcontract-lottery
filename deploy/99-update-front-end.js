const fs = require("fs")
const { ethers, network } = require("hardhat")

const FRONT_END_ADDRESS_FILE =
  "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end...")
    updateContractAddresses()
    updateAbi()
  }
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract("Raffle")
  const chainId = network.config.chainId.toString()
  const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf8"))
  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId].includes(raffle.address)) {
      contractAddresses.push(raffle.address)
    }
  } else {
    contractAddresses[chainId] = [raffle.address]
  }
  fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(contractAddresses))
}
async function updateAbi() {
  const raffle = await ethers.getContract("Raffle")
  fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
