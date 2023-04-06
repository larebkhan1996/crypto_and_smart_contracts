import React from 'react';
import './Activate.css';
import {ethers } from 'ethers';
import crypto_image from './crypto_image.png';

declare global {
    interface Window {
      ethereum: any;
    }
  }

class Activate extends React.Component{


activate = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const all_accounts = await provider.listAccounts();
    const account = all_accounts[0];
    const balance = await provider.getBalance(account);
    console.log("Account: ", account);
    console.log("Balance: ", balance.toString());

    const accountAddress = document.getElementById("accountAddress") as HTMLInputElement;
    const accountBalance = document.getElementById("accountBalance") as HTMLInputElement;

    if(account!==null){
        accountAddress.value = account;
        accountBalance.value = balance.toString();
    }}





    render() {
        return(
            <div className="Activate">
                <h1>DUTCH AUCTION DEMO</h1>
                <h2>Connecting to Account</h2>
                <button className='ActivateButton' onClick={this.activate}>Activate</button>
                <img className= "small-image" src={crypto_image} alt="My Image" />
                <h2> Account info</h2>
                <label>Account Address:
                    <input type="text" id="accountAddress" name="accountAddress" />

                </label>
                <br/>
                <label>Account Balance:
                    <input type="text" id="accountBalance" name="accountBalance" />
                </label>
                <br/>

            </div>

        );
    }
}
export default Activate;
