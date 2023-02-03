import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import BasicDutchAuction from "../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json";

describe("BasicDutchAuction Test Cases", () => {

  let auction_seller: Signer;
  let auction_buyer: Signer;
  let instance: Contract;

  beforeEach(async () => {
    [auction_seller, auction_buyer] = await ethers.getSigners();

    const tokenFactory = new ContractFactory(
      BasicDutchAuction.abi,
      BasicDutchAuction.bytecode,
      auction_seller
    );

    instance = await tokenFactory.deploy(500, 3, 50);
  });

  describe("Testing Bid function", () => {
    it("Testing Winner", async () => {

      const auction_winner = await instance.bid({ value: 1000, gasLimit: 500000 });
      expect(auction_winner.from).to.equal(await auction_seller.getAddress());
    });

    it("Testing to reject the bid if the amount is less than current price", async () => {

      await expect(instance.bid({ value: 500, gasLimit: 5000000 })).to.be.rejectedWith("Bid value is less than current price.")
    });

    it("Testing to take no more bids after winner has been declared", async () => {

      const auction_winner = await instance.bid({ value: 1000, gasLimit: 5000000 });

      const new_bidder = await expect(instance.bid({ value: 1200, gasLimit: 5000000 })).to.be.rejectedWith("Winner has been chosen. No more bidding. Auction closed");;

    });
  });



});
