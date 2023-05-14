// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./MyERC20Token.sol";
import "./MyERC721Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable {
    uint256 public ratio;
    uint256 public price;
    MyERC20Token public paymentToken;
    MyERC721Token public nftContract;
    uint256 public withdrawableAmount;

    constructor(uint _ratio, uint256 _price, MyERC20Token _paymentToken, MyERC721Token _nftContract) {
        ratio = _ratio;
        price = _price;
        paymentToken = _paymentToken;
        nftContract = _nftContract;
    }

    function buyTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * ratio);
    }

    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount/ratio);
    }

    function buyNFT(uint256 tokenId) external {
        paymentToken.transferFrom(msg.sender, address(this),price);
        nftContract.safeMint(msg.sender, tokenId);
        
        withdrawableAmount += price/2;
        
    }

    function withdraw(uint256 amount) external onlyOwner {
        withdrawableAmount -= amount;
        paymentToken.transfer(owner(), amount);
    }
    
    
}