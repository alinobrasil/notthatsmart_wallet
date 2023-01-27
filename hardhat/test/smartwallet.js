const { expect } = require("chai")
const { ethers, network } = require("hardhat")


// These are on polygon mainnet
const USDC_CONTRACT = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const USDC_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';
const USDC_decimals = 10 ** 6
// const SMART_WALLET_ADDRESS = '0xeC20dCBf0380F1C9856Ee345aF41F62Ee45a95a1';

const aaveLendingPoolAddr = '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf';


describe("Testing Smart wallet....", () => {
    let accounts
    let usdcToken;
    let whale_signer;


    before(async () => {

        //deploy smart contract
        const walletFactory = await hre.ethers.getContractFactory("Wallet");

        walletcontract = await walletFactory.deploy();
        await walletcontract.deployed();
        console.log(
            `Wallet contract deployed to ${walletcontract.address}`
        );
        expect(walletcontract.address.length).to.equal(42)

        //unlock USDC
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [USDC_WHALE],
        })

        whale_signer = await ethers.getSigner(USDC_WHALE)
        usdcToken = await ethers.getContractAt("IERC20", USDC_CONTRACT)
        accounts = await ethers.getSigners()

        //Send some USDC to smart wallet (Smart wallet receives tokens)
        const amount = 1000n * 10n ** 6n

        console.log("USDC balance of whale", await usdcToken.balanceOf(USDC_WHALE) / USDC_decimals)
        expect(await usdcToken.balanceOf(USDC_WHALE)).to.gte(amount)

        await usdcToken
            .connect(whale_signer)
            .transfer(walletcontract.address, amount)

        console.log(
            "USDC balance of smartWallet",
            await usdcToken.balanceOf(walletcontract.address) / USDC_decimals
        )
    })

    it("move tokens out of smart wallet (transfer)", async () => {
        console.log("smart wallet USDC before: ", await usdcToken.balanceOf(walletcontract.address) / USDC_decimals);

        const transferAmount = 100n * 10n ** 6n
        tx = walletcontract.transfer(
            USDC_CONTRACT,
            accounts[0].address,
            transferAmount.toString()
        )

        console.log("smart wallet USDC after: ", await usdcToken.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("account[0] USDC: ", await usdcToken.balanceOf(accounts[0].address) / USDC_decimals);

        expect(await usdcToken.balanceOf(walletcontract.address)).gte(transferAmount.toString())
    })

    it("Deposit USDC into aave v2 and then withdraw", async () => {
        const depositAmount = 100n * 10n ** 6n
        tx = await walletcontract.aave_deposit(
            USDC_CONTRACT,
            depositAmount.toString()
        )
        // console.log(tx);

        //check atoken balance. if deposit successful, atoken amount should not be 0
        const USDC_aTOKEN_ADDR = '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F';
        const atokenContract = await ethers.getContractAt("IERC20", USDC_aTOKEN_ADDR)
        let atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", await usdcToken.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("atoken balance of smart wallet = ", atokenBalance);
        expect(atokenBalance).to.be.greaterThan(0);

        //withdraw
        tx = await walletcontract.aave_withdraw(USDC_CONTRACT, depositAmount.toString());


        //check atoken balance. should be 0 or close to it
        atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", await usdcToken.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("atoken balance after withdraw: ", atokenBalance)
        expect(atokenBalance).lessThanOrEqual(1n);
        //sometimes you already accrue 10^-6 USDC interest during this test


        //check allowance of aave lending pool. should be 0.
        const allowance_USDC = await usdcToken.allowance(USDC_WHALE, aaveLendingPoolAddr);
        console.log("allowance: ", allowance_USDC);
        expect(allowance_USDC).to.equal(0);

    })

})
