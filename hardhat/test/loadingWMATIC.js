const { expect } = require("chai")
const { ethers, network } = require("hardhat")
const BigNumber = require("bignumber.js");

const WETH9 = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; //WMATIC

describe("Loading WMATIC", function () {
    let walletcontract
    let accounts
    const provider = new ethers.providers.Web3Provider(network.provider);

    before(async () => {
        //deploy smart contract
        const walletFactory = await hre.ethers.getContractFactory("Wallet");
        walletcontract = await walletFactory.deploy();
        await walletcontract.deployed();
        console.log(
            `Wallet contract deployed to ${walletcontract.address}`
        );
        expect(walletcontract.address.length).to.equal(42)

        wmatic = await ethers.getContractAt("IWETH", WETH9); //weth is actually wmatic
        accounts = await ethers.getSigners();
    })

    it("Receive MATIC / Convert to WMATIC", async () => {
        const amount = ethers.utils.parseEther("100");
        await accounts[0].sendTransaction({
            to: walletcontract.address,
            value: amount,
            // gasLimit: ethers.utils.hexlify(3000000000)
        })

        let wmaticBalance = await wmatic.balanceOf(walletcontract.address);
        wmaticBalance = ethers.utils.formatEther(wmaticBalance.toString())
        console.log("WMATIC balance: ", wmaticBalance);

        let nativeBalance = await provider.getBalance(walletcontract.address);
        console.log("Native balance: ", ethers.utils.formatEther(nativeBalance.toString()));

        expect(parseInt(wmaticBalance)).to.equal(parseInt(ethers.utils.formatEther(amount.toString())))
    })



    // })


})