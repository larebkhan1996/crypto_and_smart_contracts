import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer,BigNumber } from "ethers";
import Lareb20Tokencontract from "../artifacts/contracts/ERC20Token.sol/Lareb20Token.json";
import {Lareb20Token} from "../typechain-types"
import LarebToken from "../artifacts/contracts/NFTMintContract.sol/LarebToken.json";

async function getPermitSignature(signer:any, token:Contract, spender:string, value:BigNumber, deadline:BigNumber) {

   const [nonce, name, version, chainId] = await Promise.all([
       token.nonces(signer.address),
       token.name(),
       "1",
       signer.getChainId(),
   ])

   return ethers.utils.splitSignature(
       await signer._signTypedData(
           {
               name,
               version,
               chainId,
               verifyingContract: token.address,
           },
           {
               Permit: [
                   {
                       name: "owner",
                       type: "address",
                   },
                   {
                       name: "spender",
                       type: "address",
                   },
                   {
                       name: "value",
                       type: "uint256",
                   },
                   {
                       name: "nonce",
                       type: "uint256",
                   },
                   {
                       name: "deadline",
                       type: "uint256",
                   },
               ],
           },
           {
               owner: signer.address,
               spender,
               value,
               nonce,
               deadline,
           }
       )
   )
}

describe("Custom Token Testing", () => {
  let sender: Signer;
  let receiver: Signer;
  let contractInstance: Contract;
  let tokenInstance: Contract;

  
  beforeEach(async () => {
    [sender, receiver] = await ethers.getSigners();

    const TokenFactory = new ContractFactory(
      Lareb20Tokencontract.abi,
      Lareb20Tokencontract.bytecode,
      sender
    );

    tokenInstance = await TokenFactory.deploy(500);
  });

  describe("Token Testing Starts", () => {
    it("should check the total supply after minting new tokens", async () => {
      const mintedTokens = 250;
      await tokenInstance.mint(receiver.getAddress(), mintedTokens);
      const totalSupply = await tokenInstance.totalSupply();

      expect(totalSupply).to.equal(mintedTokens);
    });


    it("should reject minting new tokens if the max supply is exceeded", async () => {
      const mintedTokens = 450;
      await tokenInstance.mint(receiver.getAddress(), mintedTokens);
      await expect(
        tokenInstance.mint(receiver.getAddress(), mintedTokens)
      ).to.be.rejectedWith("Max tokens limit exceeded");
    });

    it("token permit check",async function (){
      const MintFactory = new ContractFactory(LarebToken.abi, LarebToken.bytecode,
        sender);
        let mintAuctionContract:Contract;
        let nft_dutch_auction_contract:Contract;
         mintAuctionContract = await MintFactory.deploy()
         mintAuctionContract.initialize(5);

     
    

   
     const NFTcontractFactory = await ethers.getContractFactory("NFTDutchAuction");

     

     nft_dutch_auction_contract = await upgrades.deployProxy(
         NFTcontractFactory,
         [tokenInstance.address, mintAuctionContract.address, 0, 100, 10, 10],
         {
             kind: "uups",
             initializer: "initialize(address, address,uint256,uint256,uint256,uint256)",
             
         }
     );
    
     const deadline = ethers.constants.MaxUint256;
     const amount = BigNumber.from(499);
     const { v, r, s } = await getPermitSignature(
         sender,
         tokenInstance,
         nft_dutch_auction_contract.address,
         amount,
         deadline
     )
 await (tokenInstance.permit(sender.getAddress(),nft_dutch_auction_contract.address,amount,deadline,v,r,s));
    });

  });
});
