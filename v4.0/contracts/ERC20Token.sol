// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lareb20Token is ERC20 {
    uint256 maxTokens;
    constructor(uint256 _maxTokens) ERC20("Lareb20Token", "LTK") {
        maxTokens=_maxTokens;
    }

    function mint(address to, uint256 tokens) public  {
        
        uint256 circularSupply=totalSupply();
        require((circularSupply+tokens)<maxTokens,"Max tokens limit exceeded");
        _mint(to, tokens);
    }
}
