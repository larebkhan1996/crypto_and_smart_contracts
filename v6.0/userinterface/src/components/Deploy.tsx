import React from 'react';

import {ethers } from 'ethers';
import BasicDutchAuction from './BasicDutchAuction.json';
import './Deploy.css';
import deploy from './deploy.png';

class Deploy extends React.Component{

    deploy = async () => {
        const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
        const contract = new ethers.ContractFactory(BasicDutchAuction.abi, BasicDutchAuction.bytecode, signer);

        const initialPrice = document.getElementById("initialPrice") as HTMLInputElement;
        const numberOfBlocks = document.getElementById("numberOfBlocks") as HTMLInputElement;
        const priceDecrement = document.getElementById("priceDecrement") as HTMLInputElement;
        console.log('initialPrice', initialPrice.value);
        console.log('numberOfBlocks', numberOfBlocks.value);
        console.log('priceDecrement', priceDecrement.value);

        const contractAddress = document.getElementById("contractAddress") as HTMLInputElement;

        const deployedContract = await contract.deploy(initialPrice.value, numberOfBlocks.value, priceDecrement.value);
        await deployedContract.deployed();
        console.log("Contract deployed to:", deployedContract.address);
        contractAddress.value = deployedContract.address;





    }


    render(){
        return(
            <div className="Deploy">
                <h1>Deploying Contract</h1>
                <img className= "small-image" src={deploy} alt="My Image" />
                <label>Contract Initial Price:
                    <input type="text" id="initialPrice" name="initialPrice" />
                </label>
                <br/>
                
                <label>Number of Blocks: &nbsp;&nbsp;
                    <input type="text" id="numberOfBlocks" name="numberOfBlocks" />
                </label>
                <br/>
                <label>Price Decrement: &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="text" id="priceDecrement" name="priceDecrement" />
                </label>
                <br/>
                 
                <button className='DeployButton' onClick={this.deploy}>Deploy</button>
                <br/>
                <label>Contract Address:
                    <input type="text" id="contractAddress" name="contractAddress" />
                </label>
                <br/>
            </div>
        );
    }
}

export default Deploy;