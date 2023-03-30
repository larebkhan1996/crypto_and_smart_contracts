import React from 'react';

import {ethers } from 'ethers';
import BasicDutchAuction from './BasicDutchAuction.json';
import './Info.css';
import info from './info.png';

class Info extends React.Component{

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
        
        console.log(contract);

        const currentPriceValue = await contract.get_current_price();
       
        const ownerValue = await contract.seller();
        
        const auctionStatusValue = await contract.auction_open();
        

       
       


        if(currentPriceValue!==null){
            currentPrice.value = currentPriceValue.toString();
        }
        if(ownerValue!==null){
            owner.value = ownerValue.toString();
        }
        
        
        if(auctionStatusValue!==null){
            auctionStatus.value = auctionStatusValue.toString();
        }





    }




    render(){
        return(
            <div className="infoContract">
                <h1>Information about the Contract</h1>
                <img className= "small-image" src={info} alt="My Image" />
                <label>Contract Address:
                    <input type="text" id="contractAddress" name="contractAddress" />
                </label>
                <br/>
                <button className='InfoButton' onClick={this.getInfo}>Get info</button>
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
                <br/>
                
            </div>
        );
    }
}
export default Info;