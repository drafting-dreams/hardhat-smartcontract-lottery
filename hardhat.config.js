require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const { GOERLI_RPC_URL, PRIVATE_KEY, COINMARKETCAP_API_KEY, ETHERSCAN_API_KEY } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 6,
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 800000,
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
    },
  },
}
