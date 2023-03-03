import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import Lareb20Token from "../artifacts/contracts/ERC20Token.sol/Lareb20Token.json";

describe("Custom Token Testing", () => {
  let sender: Signer;
  let receiver: Signer;
  let contractInstance: Contract;
  let tokenInstance: Contract;

  
  beforeEach(async () => {
    [sender, receiver] = await ethers.getSigners();

    const TokenFactory = new ContractFactory(
        Lareb20Token.abi,
        Lareb20Token.bytecode,
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

  });
});
