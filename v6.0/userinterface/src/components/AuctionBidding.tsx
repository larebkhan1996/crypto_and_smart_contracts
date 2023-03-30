import React from 'react';

import {ethers } from 'ethers';
import BasicDutchAuction from './BasicDutchAuction.json';
import './AuctionBidding.css';
import bid from './bid.png';
import info from './info.png';

class AuctionBidding extends React.Component{
    getInfo = async () => {
        const signer= new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractAddress = document.getElementById("contractAddress") as HTMLInputElement;

        const contract = new ethers.Contract(contractAddress.value.toString(), BasicDutchAuction.abi, signer);

        const currentPrice = document.getElementById("currentPrice") as HTMLInputElement;
        const owner = document.getElementById("owner") as HTMLInputElement;
        const auctionStatus = document.getElementById("auctionStatus") as HTMLInputElement;
        const initialPrice = document.getElementById("initialPrice") as HTMLInputElement;
        const numberOfBlocks = document.getElementById("numberOfBlocks") as HTMLInputElement;
        const priceDecrement = document.getElementById("priceDecrement") as HTMLInputElement;
        const winnerAddressInfo = document.getElementById("winnerAddressInfo") as HTMLInputElement;
        
        console.log(contract);

        const currentPriceValue = await contract.get_current_price();
       
        const ownerValue = await contract.seller();
        
        const auctionStatusValue = await contract.auction_open();
        const winnerAddressValue = await contract.winner();

        const default_address='0x0000000000000000000000000000000000000000';


        
        

       
       


        if(currentPriceValue!==null){
            currentPrice.value = currentPriceValue.toString();
        }
        if(ownerValue!==null){
            owner.value = ownerValue.toString();
        }
        
        
        if(auctionStatusValue!==null){
            auctionStatus.value = auctionStatusValue.toString();
        }


        if(winnerAddressValue !== null){
            if(winnerAddressValue.toString()===default_address){
                winnerAddressInfo.value = "0x00";
            }
            else{
            
            winnerAddressInfo.value = winnerAddressValue.toString();
            currentPrice.value = '0';
            auctionStatus.value ='false';


            
            }
        }






    }


    bidding = async () => {
        const statusAfterBidding = document.getElementById("statusAfterBidding") as HTMLInputElement;
        try{
        const signer= new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contractAddress = document.getElementById("contractAddressInfo") as HTMLInputElement;
        const biddingPrice = document.getElementById("biddingPrice") as HTMLInputElement;
       
        const winnerAddress = document.getElementById("winnerAddress") as HTMLInputElement;

        const contract = new ethers.Contract(contractAddress.value.toString(), BasicDutchAuction.abi, signer);
        const winner= await contract.bid({value: `${biddingPrice.value}`});

        if(winner!==null){
            statusAfterBidding.value="Bidding Successful! You have won the auction."
            winnerAddress.value = winner.from;

        }}
        catch(error:any){
            statusAfterBidding.value=error.reason;
        }


       
    }




    render(){
        return(
            
            <div className="AuctionBidding">
                
                <h1>Information about the Contract</h1>
                <img className= "small-image" src={info} alt="My Image" />
                <label>Contract Address:
                    <input type="text" id="contractAddressInfo" name="contractAddress" />
                </label>
                <br/>
                <button className='BidButton' onClick={this.getInfo}>Get info</button>
                <br/>
                <label>Current Price: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="currentPrice" name="currentPrice" />
                </label>
                <br/>
                <label>Contract Owner: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="owner" name="owner" />
                </label>
                <br/>
                <label>Dutch Auction Status:
                    <input type="text" id="auctionStatus" name="auctionStatus" />
                </label>
                <label>Winner Address: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="winnerAddressInfo" name="winnerAddressInfo" />
                </label>
                <br/>
                
            
                <h1>Auction Bidding</h1>
                <img className= "small-image" src={bid} alt="My Image" />
                <label>Contract Address:
                    <input type="text" id="contractAddress" name="contractAddress" />
                </label>

                <label>Bidding Price: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="biddingPrice" name="biddingPrice" />
                </label>
                <br/>
                <button className='BidButton' onClick={this.bidding}>Bid</button>
                <br/>
                <label >Status after bidding
                    <input className= 'status-label' type="text" id="statusAfterBidding" name="statusAfterBidding" />
                </label>
                <br/>
                <label>Winner's address: &nbsp;&nbsp;
                    <input type="text" id="winnerAddress" name="winnerAddress" />
                </label>
                <br/>
                
            </div>
        );
    }
}
export default AuctionBidding;