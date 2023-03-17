import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";

import LarebToken from "../artifacts/contracts/NFTMintContract.sol/LarebToken.json";

//imported all the libraries required to write the test cases
describe("MintContractAuction", () => {

  let nft_dutch_auction_seller: Signer;
  let nft_dutch_auction_buyer: Signer;
  let mintAuctionContract: Contract;

  //wrote the test cases below and used beforeEach to deploy mint contract before testing 
  beforeEach(async () => {
    [nft_dutch_auction_seller, nft_dutch_auction_buyer] = await ethers.getSigners();

    const MintFactory = new ContractFactory(LarebToken.abi, LarebToken.bytecode,
      nft_dutch_auction_seller);
    
      mintAuctionContract = await MintFactory.deploy()
      mintAuctionContract.initialize(2)
    



  });

  describe("Bid", () => {
    it("Testing - Minting a token first ", async () => {

      await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 123)
      const balance = await mintAuctionContract.balanceOf(nft_dutch_auction_seller.getAddress())
      expect(balance).to.equal(1);

    });

    it("Testing1  - Checking the owner of the tokenId", async () => {
      await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 123)
      const owner_address = await mintAuctionContract.ownerOf(123)
      

      expect(owner_address).to.equal(await nft_dutch_auction_seller.getAddress());
    });

    it("Testing - Max Supply", async () => {
      await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 123);
      await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 124);
      await expect(mintAuctionContract.safeMint(await 
        nft_dutch_auction_seller.getAddress(), 124)).to.be.rejectedWith("NFTs limit exceeded");

      
    });







  });
});
