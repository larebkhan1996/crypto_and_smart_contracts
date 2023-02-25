import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";

import NFTDutchAuction from "../artifacts/contracts/NFTDutchAuction.sol/NFTDutchAuction.json";
import LarebToken from "../artifacts/contracts/NFTMintContract.sol/LarebToken.json";
import Lareb20Token from "../artifacts/contracts/ERC20Token.sol/Lareb20Token.json";

//imported all the necessary imports and libraries

describe("NFTDutchAuction", () => {

    let nft_dutch_auction_seller: Signer;
    let nft_dutch_auction_buyer: Signer;
    let nft_dutch_auction_contract: Contract;
    let mintAuctionContract: Contract;
    let ltokenContract: Contract;

    //in the below code, using before each and implementing safemint and approving the mintcontract by dutch auction and vice versa
    beforeEach(async () => {
       
        [ nft_dutch_auction_seller, nft_dutch_auction_buyer] = await ethers.getSigners();

        const MintFactory = new ContractFactory(LarebToken.abi, LarebToken.bytecode,
           nft_dutch_auction_seller);
        
            mintAuctionContract = await MintFactory.deploy()
            mintAuctionContract.initialize(5);
        const erc20tokenFactory=new ContractFactory(Lareb20Token.abi, Lareb20Token.bytecode,
            nft_dutch_auction_seller)
        
        ltokenContract = await erc20tokenFactory.deploy(400);

      
        const NFTcontractFactory = new ContractFactory(
            NFTDutchAuction.abi,
            NFTDutchAuction.bytecode,
            nft_dutch_auction_seller
        );
        
        nft_dutch_auction_contract = await NFTcontractFactory.deploy(ltokenContract.address,mintAuctionContract.address, 0, 100, 10, 10);

    });

    describe("Placing bid", () => {
        it("Bidding price less than initial price", async () => {
            await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 0)

            await mintAuctionContract.approve(nft_dutch_auction_contract.address, 0)


            await ltokenContract.mint(nft_dutch_auction_buyer.getAddress(), 200)

            await ltokenContract.connect(nft_dutch_auction_buyer).approve(nft_dutch_auction_contract.address, 600);

            await expect(nft_dutch_auction_contract.functions.bid(150)).to.be.rejectedWith("The value of the bid is less than the bidding price'");
        });

        it("Checking allowance", async () => {
            await expect(nft_dutch_auction_contract.functions.bid(205)).to.be.rejectedWith(
                "ERC20: insufficient allowance");
        
            
            
        });

        it("No bidding after auction has been closed",async () =>{

            await nft_dutch_auction_contract.finishAuction();

            await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 0)

            await mintAuctionContract.approve(nft_dutch_auction_contract.address, 0)


            await ltokenContract.mint(nft_dutch_auction_buyer.getAddress(), 200)

            await ltokenContract.connect(nft_dutch_auction_buyer).approve(nft_dutch_auction_contract.address, 600);

            await expect(nft_dutch_auction_contract.functions.bid(205)).to.be.rejectedWith("We got the winner. therefore no more bids can happen. The auction is now closed");
       


        });

        it("No bidding after time has elapsed",async () =>{

            await ethers.provider.send("evm_increaseTime",[7860]);
            await ethers.provider.send("evm_mine",[]);

            await mintAuctionContract.safeMint(await nft_dutch_auction_seller.getAddress(), 0)

            await mintAuctionContract.approve(nft_dutch_auction_contract.address, 0)


            await ltokenContract.mint(nft_dutch_auction_buyer.getAddress(), 200)

            await ltokenContract.connect(nft_dutch_auction_buyer).approve(nft_dutch_auction_contract.address, 600);

            await expect(nft_dutch_auction_contract.functions.bid(205)).to.be.rejectedWith("Auction is ended now. So you cannot bid anymore for this");
       


        });

        it("only selelr can close the auction",async () =>{

            await expect(nft_dutch_auction_contract.connect(nft_dutch_auction_buyer).finishAuction()).to.be.rejectedWith(
                "Auction can be closed by seller");
        });






      

     






    });
            
       

      


      


    });
