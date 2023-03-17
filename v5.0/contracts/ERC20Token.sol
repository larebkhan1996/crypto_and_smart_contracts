// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Lareb20Token is ERC20,ERC20Permit {
    uint256 maxTokens;
    constructor(uint256 _maxTokens) ERC20("Lareb20Token", "LTK")ERC20Permit ("Lareb20Token"){
        maxTokens=_maxTokens;
    }

    function mint(address to, uint256 tokens) public  {
        
        uint256 circularSupply=totalSupply();
        require((circularSupply+tokens)<maxTokens,"Max tokens limit exceeded");
        _mint(to, tokens);
    }
}
