//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IMintContract {
  function safeTransferFrom(address from, address to, uint256 tokenId)external;

}
interface IERC20Token{
    function transferFrom(address from, address to, uint256 tokenId)external returns(bool);

}
//Creating the NFT dutch auction and importing the zeppling imports above
contract NFTDutchAuction is Initializable
{
    
    
    uint256 private reservePrice;
    uint256 private numBlocksAuctionOpen;
    uint256 private offerPriceDecrement;
    uint256 public initialPrice;
    address public seller;
    address public nft_dutch_auction_winner;
    uint256 public end_auction;
    bool public closed_auction;
    uint256 private nftTokenId;
    uint256 public currentPrice;
    address public erc721TokenAddress;
    address public erc20TokenAddress;

    IMintContract nftcontract;
    IERC20Token erccontract;

    constructor(address _erc20TokenAddress,address _erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)  {
       
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice =reservePrice + numBlocksAuctionOpen *offerPriceDecrement;
        currentPrice=initialPrice;
        end_auction = block.number + numBlocksAuctionOpen;
        closed_auction = false;
        seller=msg.sender;


        erc20TokenAddress = _erc20TokenAddress;
        erc721TokenAddress= _erc721TokenAddress;
        erccontract=IERC20Token(erc20TokenAddress);
        nftcontract=IMintContract(erc721TokenAddress);



        

        }
    
    

     function bid(uint256 bidingValue) public returns (address) {
        require(
            block.number <= end_auction,
            "Auction is ended now. So you cannot bid anymore for this"
        );
        require(
            bidingValue >= initialPrice,
            "The value of the bid is less than the bidding price"
        );
        require(
            closed_auction == false,
            "We got the winner. therefore no more bids can happen. The auction is now closed"
        );
        

        nft_dutch_auction_winner = msg.sender;
        initialPrice = 0;
        closed_auction = true;

        erccontract.transferFrom(msg.sender,seller,bidingValue);
        nftcontract.safeTransferFrom(seller, nft_dutch_auction_winner, nftTokenId);
        return (nft_dutch_auction_winner);
    }
    function finishAuction() public {
    require(msg.sender == seller, "Auction can be closed by seller");
    
    
    closed_auction = true;
}
}
