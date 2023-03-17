// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// created this code using openzepplin
contract LarebToken is Initializable, ERC721Upgradeable {
    

    uint256  maxNFT;
    uint256 countNFT=0;
    function initialize(uint256  _maxNFT) initializer public {
        __ERC721_init("LarebToken", "MTK");

        maxNFT=_maxNFT;

    }

    function safeMint(address to, uint256 tokenId)
        public
    {   require(countNFT<maxNFT,"NFTs limit exceeded");
        _safeMint(to, tokenId);
        countNFT+=1;

       
    }

   

}
