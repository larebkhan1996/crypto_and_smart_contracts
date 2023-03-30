import React from 'react';
import Activate from './components/Activate';
import Deploy from './components/Deploy';
import Info from './components/Info';
import AuctionBidding from './components/AuctionBidding';
import './App.css';


class App extends React.Component{
  render(){
  return (
   <div className="App">
     <Activate/>
      <Deploy/>
      <AuctionBidding/>
    </div>
  );
}}

export default App;
