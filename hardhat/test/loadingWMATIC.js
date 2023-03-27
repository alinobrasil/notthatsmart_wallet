const { expect } = require("chai")
const { ethers, network } = require("hardhat")
const BigNumber = require("bignumber.js");

const WETH9 = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; //WMATIC

describe("Loading WMATIC", function () {
    let walletcontract

    before(async () => {
        //deploy smart contract
        const walletFactory = await hre.ethers.getContractFactory("Wallet");
        walletcontract = await walletFactory.deploy();
        await walletcontract.deployed();
        console.log(
            `Wallet contract deployed to ${walletcontract.address}`
        );
        expect(walletcontract.address.length).to.equal(42)
    })



})