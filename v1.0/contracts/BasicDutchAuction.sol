//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BasicDutchAuction {

    //declaring all the required variables
    uint256 private reservePrice;
    uint256 private numBlocksAuctionOpen;
    uint256 private offerPriceDecrement;
    uint256 private initialPrice;
    address private seller;
    address private auction_winner;
    uint256 private auctionEnd;
    bool private auctionClosed;
    
    //defining the contructor
    constructor(uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement)  {
        
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        initialPrice = _reservePrice + _numBlocksAuctionOpen * _offerPriceDecrement;
        auctionEnd = block.number + numBlocksAuctionOpen;
        auctionClosed = false;
        seller = msg.sender;
    }

    function bid() public payable returns(address) {
        require(block.number <= auctionEnd, "Auction has already ended.No more bids");
        require(msg.value >= initialPrice, "Bid value is less than current price.");
        require(auctionClosed==false,"Winner has been chosen. No more bidding. Auction closed");
        
        auction_winner = msg.sender;
        initialPrice = 0;
        auctionClosed = true;
        payable(seller).transfer(msg.value);
    
        return auction_winner;
    }
}