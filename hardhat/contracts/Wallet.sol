// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ILendingPool} from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";

contract Wallet {
    address public owner;
    mapping(address => uint256) public balances;
    address public aaveLendingPoolAddr;

    constructor() public {
        owner = msg.sender;
        aaveLendingPoolAddr = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;
    }

    function deposit() public payable {
        require(msg.value > 0, "Cannot deposit 0 or less wei");
        require(msg.sender == owner, "Only the owner can deposit funds");

        // Depositing funds is the same as transferring them to the contract
        ERC20(msg.sender).transfer(address(this), msg.value);
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Cannot withdraw 0 or less wei");
        require(msg.sender == owner, "Only the owner can withdraw funds");

        // Withdrawing funds is the same as transferring them from the contract to the owner
        ERC20(msg.sender).transfer(owner, amount);
    }

    function transfer(
        address token,
        address recipient,
        uint256 amount
    ) public {
        require(amount > 0, "Cannot transfer 0 or less tokens");
        require(msg.sender == owner, "Only the owner can transfer tokens");

        // Transferring tokens is done by calling the transfer function on the token contract
        ERC20(token).transfer(recipient, amount);
    }

    function balanceOf(address token) public view returns (uint256) {
        // The balance is determined by calling the balanceOf function on the token contract
        return ERC20(token).balanceOf(address(this));
    }

    // aave: deposit funds
    function aave_deposit(address assetAddress, uint256 amount) public {
        // lending pooL: 0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf

        //approve
        ERC20(assetAddress).approve(aaveLendingPoolAddr, amount);

        //deposit
        ILendingPool(aaveLendingPoolAddr).deposit(
            assetAddress, //address of token to deposit
            amount, //amount of asset to deposit
            address(this), //who should receive aTokens
            0 //referral code
        );
    }

    function aave_withdraw(address assetAddress, uint256 amount) public {
        ILendingPool(aaveLendingPoolAddr).withdraw(
            assetAddress,
            amount,
            address(this)
        );
    }
}
