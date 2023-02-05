// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ILendingPool} from "./interfaces/aave/ILendingPool.sol";

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol"; //v0.6.0
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol"; //0.7.5

import "./interfaces/quickswap/UniswapInterfaces.sol";

contract Wallet {
    address payable public owner;

    //uniswapv3
    address public constant aaveLendingPoolAddr =
        0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;

    //quickswap (uniswapv2)
    address private constant ROUTER =
        0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    //quickswap uses uniswap router v2

    address private constant FACTORY =
        0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32;

    constructor() public {
        owner = payable(msg.sender);
        // aaveLendingPoolAddr = 0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf;
    }

    // be able to receive native eth tokens
    receive() external payable {}

    // function getBalance() external view returns (uint256) {
    //     return address(this).balance;
    // }

    function withdraw(uint256 amount, address recipient) external {
        require(msg.sender == owner, "Must be Owner");
        payable(recipient).transfer(amount);
    }

    // transfer any ERC20 token out of wallet
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
    //use v3 to enable swaps between any tokens
    //need a whitelist of tokens to swap
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    uint24 public constant poolFee = 3000;

    function swapExactInputSingle(
        uint256 amountIn,
        address originalToken,
        address newToken
    ) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        // Approve the router to spend
        TransferHelper.safeApprove(
            originalToken,
            address(swapRouter),
            amountIn
        );

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: originalToken,
                tokenOut: newToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        ) = IUniswapV2Router(ROUTER).addLiquidity(
                _tokenA,
                _tokenB,
                _amountA,
                _amountB,
                1,
                1,
                address(this),
                block.timestamp
            );
    }

    function removeLiquidity(address _tokenA, address _tokenB) external {
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

        uint256 liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER, liquidity);

        (uint256 amountA, uint256 amountB) = IUniswapV2Router(ROUTER)
            .removeLiquidity(
                _tokenA,
                _tokenB,
                liquidity,
                1,
                1,
                address(this),
                block.timestamp
            );
    }
}
