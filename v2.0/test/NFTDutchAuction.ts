import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import NFTDutchAuction from "../artifacts/contracts/NFTDutchAuction.sol/NFTDutchAuction.json";
import LarebToken from "../artifacts/contracts/MintAuctionContract.sol/LarebToken.json";

//imported all the necessary imports and libraries

describe("NFTDutchAuction", () => {

    let nft_dutch_auction_seller: Signer;
    let nft_dutch_auction_buyer: Signer;
    let nft_dutch_auction_contract: Contract;
    let mintAuctionContract: Contract;

    //in the below code, using before each and implementing safemint and approving the mintcontract by dutch auction and vice versa
    beforeEach(async () => {
        [nft_dutch_auction_seller, nft_dutch_auction_buyer] = await ethers.getSigners();

        const MintFactory = new ContractFactory(LarebToken.abi, LarebToken.bytecode,
            nft_dutch_auction_seller);
        
            mintAuctionContract = await MintFactory.deploy()
        

        await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 0, "")
        

        const NFTcontractFactory = new ContractFactory(
            NFTDutchAuction.abi,
            NFTDutchAuction.bytecode,
            nft_dutch_auction_seller
        );
        
        nft_dutch_auction_contract = await NFTcontractFactory.deploy(mintAuctionContract.address, 0, 100, 10, 10);

    });

    describe("Bid", () => {
        it("Testing - should place a bid", async () => {
            const bidValue = 210;
            await nft_dutch_auction_contract.setMintContract(mintAuctionContract.address)
            await mintAuctionContract.approve(nft_dutch_auction_contract.address, 0)

            const winner = await nft_dutch_auction_contract.functions.bid({ value: bidValue, gasLimit: 1000000 });

            
            const seller_address = await nft_dutch_auction_seller.getAddress();
            expect(winner.from).to.equal(seller_address);
        });

        it("Testing - should reject a bid if its value is less than calculated price", async () => {
            const bidValue = 80;
            await expect(nft_dutch_auction_contract.functions.bid({ value: bidValue, gasLimit: 1000000 })).to.be.rejectedWith(
                "The value of the bid is less than the bidding price");
        });



        it("Testing - should reject a bid after the end of NFT dutch auction", async () => {
            const bidValue = 210;
            await nft_dutch_auction_contract.setMintContract(mintAuctionContract.address)
            await mintAuctionContract.approve(nft_dutch_auction_contract.address, 0)
            const winner = await nft_dutch_auction_contract.functions.bid({ value: bidValue, gasLimit: 1000000 });
            const winner2 = await expect(nft_dutch_auction_contract.functions.bid({ value: 230, gasLimit: 1000000 })).to.be.rejectedWith(
                "We got the winner. therefore no more bids can happen. The auction is now closed");;

        });



    });
});