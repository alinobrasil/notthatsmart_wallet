// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILendingPool} from "./interfaces/aave/ILendingPool.sol";

// import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract Wallet {
    address public owner;
    // mapping(address => uint256) public balances;

    address public constant aaveLendingPoolAddr =
        0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;

    constructor() public {
        owner = msg.sender;
        // aaveLendingPoolAddr = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;
    }

    // deposit and withdraw ETH
    function deposit() public payable {
        require(msg.value > 0, "Cannot deposit 0 or less wei");
        require(msg.sender == owner, "Only the owner can deposit funds");

        // Depositing funds is the same as transferring them to the contract
        IERC20(msg.sender).transfer(address(this), msg.value);
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Cannot withdraw 0 or less wei");
        require(msg.sender == owner, "Only the owner can withdraw funds");

        // Withdrawing funds is the same as transferring them from the contract to the owner
        IERC20(msg.sender).transfer(owner, amount);
    }

    //transfer any ERC20 token
    function transfer(
        address token,
        address recipient,
        uint256 amount
    ) public {
        require(amount > 0, "Cannot transfer 0 or less tokens");
        require(msg.sender == owner, "Only the owner can transfer tokens");

        // Transferring tokens is done by calling the transfer function on the token contract
        IERC20(token).transfer(recipient, amount);
    }

    //check balance of ERC20 token
    function balanceOf(address token) public view returns (uint256) {
        // The balance is determined by calling the balanceOf function on the token contract
        return IERC20(token).balanceOf(address(this));
    }

    // AAVE ------------------------------------------------------------
    // aave: deposit funds
    function aave_deposit(address assetAddress, uint256 amount) public {
        // lending pooL: 0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf

        //approve
        IERC20(assetAddress).approve(aaveLendingPoolAddr, amount);

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

    //Uniswap -----------------
}
