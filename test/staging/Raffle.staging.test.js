const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat.config")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", () => {
      let raffle, raffleEntranceFee, deployer
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        raffle = await ethers.getContract("Raffle", deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
      })

      describe("fulfillRandomWords", () => {
        it("wordks with live Chainlink Keepers and Chainlink VRF, we get a random winner", async () => {
          const startingTimestamp = await raffle.getLatestTimestamp()
          const accounts = await ethers.getSigners()

          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked event fired!")

              try {
                const recentWinner = await raffle.getRecentWinner()
                const raffleState = await raffle.getRaffleState()
                const winnerEndingBalance = await accounts[0].getBalance()
                const endingTimeStamp = await raffle.getLatestTimestamp()

                await expect(raffle.getPlayer(0)).to.be.reverted
                assert.equal(recentWinner.toString(), accounts[0].address)
                assert.equal(raffleState, 0)
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                )
                assert(endingTimeStamp > startingTimestamp)
                resolve()
              } catch (error) {
                console.log(error)
                reject(error)
              }
            })

            const tx = await raffle.enterRaffle({ value: raffleEntranceFee })
            await tx.wait(1)
            console.log("OK, time to wait")
            winnerStartingBalance = await accounts[0].getBalance()
          })
        })
      })
    })
