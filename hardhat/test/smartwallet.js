const { expect } = require("chai")
const { ethers, network } = require("hardhat")


// These are on polygon mainnet


const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const WETH9 = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; //WMATIC
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const CRV = "0x172370d5Cd63279eFa6d502DAB29171933a610AF";
const BLOK = "0x229b1b6C23ff8953D663C4cBB519717e323a0a84"

const WHALE = '0x06959153B974D0D5fDfd87D561db6d8d4FA0bb0B';

const USDC_decimals = 10 ** 6
// const SMART_WALLET_ADDRESS = '0xeC20dCBf0380F1C9856Ee345aF41F62Ee45a95a1';

const aaveLendingPoolAddr = '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf';


describe("Testing Smart wallet....", () => {
    let accounts
    let whale_signer;
    let walletcontract;

    const amountIn = 10n * 10n ** 18n;

    before(async () => {

        console.log("----------Setting up tests----------")

        //deploy smart contract
        const walletFactory = await hre.ethers.getContractFactory("Wallet");
        walletcontract = await walletFactory.deploy();
        await walletcontract.deployed();
        console.log(
            `Wallet contract deployed to ${walletcontract.address}`
        );
        expect(walletcontract.address.length).to.equal(42)


        //get instsnaces of erc20 tokens
        accounts = await ethers.getSigners();
        dai = await ethers.getContractAt("IERC20", DAI);
        weth = await ethers.getContractAt("IWETH", WETH9); //weth is actually wmatic
        usdc = await ethers.getContractAt("IERC20", USDC);
        crv = await ethers.getContractAt("IERC20", CRV);
        blok = await ethers.getContractAt("IERC20", BLOK);

        //unlock whale's wallet
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [WHALE],
        });
        whale_signer = await ethers.getSigner(WHALE);

        let wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance).toFixed(2);
        console.log("smartWallet native token balance: ", wethBalance, "MATIC")



    })


    it("swap WMATIC to DAI", async () => {
        console.log("\n-----Testing Swap: WMATIC to DAI-----")

        //send some weth (WMATIC) to accounts[0]
        await weth
            .connect(whale_signer)
            .transfer(walletcontract.address, amountIn);
        let wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance).toFixed(2);
        console.log("Starting WMATIC balance: ", wethBalance)

        let daiBalance = await dai.balanceOf(walletcontract.address);
        console.log("Starting Dai balance: ", daiBalance.toString(), "DAI")

        //execute trade. WMATIC --> dai
        await walletcontract.swapExactInputSingle(
            amountIn,
            WETH9,
            DAI)
        daiBalance = await dai.balanceOf(walletcontract.address)
        daiBalance = ethers.utils.formatEther(daiBalance.toString())
        console.log("new Dai balance: ", daiBalance.toString(), "DAI")

    })

    it("Swap WMATIC to BLOK", async function () {
        console.log("\n-----Testing Swap: WMATIC to BLOK-----")
        //send some weth (WMATIC) to accounts[0]
        await weth
            .connect(whale_signer)
            .transfer(walletcontract.address, amountIn);
        let wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance);
        console.log("Starting WMATIC balance: ", wethBalance.toFixed(2))

        let blokBalance = await blok.balanceOf(walletcontract.address);
        console.log("Starting BLOK balance: ", blokBalance.toString())

        //execute trade. WMATIC --> dai
        await walletcontract.swapExactInputSingle(
            amountIn,
            WETH9,
            BLOK)

        blokBalance = await blok.balanceOf(walletcontract.address);
        expect(blokBalance).to.be.greaterThan(0)
        blokBalance = ethers.utils.formatEther(blokBalance.toString())
        blokBalance = Number(blokBalance).toFixed(2);
        console.log("Blok balance after swap: ", blokBalance)

        //show WMATIC balance after swap
        wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance).toFixed(2);
        console.log("WMATIC balance after swap: ", wethBalance)

    })

    it("Swap USDC to DAI", async function () {
        console.log("\n-----Testing Swap: USDC to DAI-----")

        const usdcAmount = 10 * 10 ** 6
        await usdc
            .connect(whale_signer)
            .transfer(walletcontract.address, usdcAmount);
        let usdcBalance = await usdc.balanceOf(walletcontract.address);
        console.log("starting USDC balance: ", usdcBalance / 10 ** 6)

        let daiBalance = await dai.balanceOf(walletcontract.address);
        daiBalance = ethers.utils.formatEther(daiBalance.toString())
        daiBalance = Number(daiBalance).toFixed(2);
        console.log("Starting Dai balance: ", daiBalance, "DAI")

        //execute trade. WMATIC --> dai
        await walletcontract
            .connect(accounts[0])
            .swapExactInputSingle(
                usdcAmount.toString(),
                USDC,
                DAI);

        //check dai balance
        daiBalance = await dai.balanceOf(walletcontract.address)
        expect(daiBalance).to.be.greaterThan(0)

        //show USDC balance after swap
        usdcBalance = await usdc.balanceOf(walletcontract.address);
        console.log("USDC balance after swap: ", usdcBalance / 10e6)


        //show dai balance after the swap
        daiBalance = ethers.utils.formatEther(daiBalance.toString())
        daiBalance = Number(daiBalance).toFixed(2);
        console.log("Dai balance after swap: ", daiBalance, " DAI")
    })



    it("Swap CRV to WMATIC", async function () {
        console.log("\n-----Testing Swap: CRV to WMATIC-----")

        //send some crv to accounts[0]
        await crv
            .connect(whale_signer)
            .transfer(walletcontract.address, amountIn);
        let crvBalance = await crv.balanceOf(walletcontract.address);
        crvBalance = ethers.utils.formatEther(crvBalance.toString())
        crvBalance = Number(crvBalance).toFixed(2);
        console.log("Starting CRV balance: ", crvBalance)

        let wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance).toFixed(2);
        console.log("Starting WMATIC balance: ", wethBalance)

        console.log("execute swap.....")
        //execute trade. WMATIC --> dai
        await walletcontract.swapExactInputSingle(
            amountIn,
            CRV,
            WETH9)

        crvBalance = await crv.balanceOf(walletcontract.address);
        crvBalance = ethers.utils.formatEther(crvBalance.toString())
        crvBalance = Number(crvBalance).toFixed(2);
        console.log("final CRV balance: ", crvBalance)


        wethBalance = await weth.balanceOf(walletcontract.address);
        wethBalance = ethers.utils.formatEther(wethBalance.toString())
        wethBalance = Number(wethBalance).toFixed(2);
        console.log("final WMATIC balance: ", wethBalance)


    })


    it("move tokens out of smart wallet (transfer)", async () => {
        console.log("\n-----Test moving tokens out of smart wallet-----")


        //load up some USDC in smart contract
        const transferAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, transferAmount);
        console.log("smart wallet USDC: ", await usdc.balanceOf(walletcontract.address) / USDC_decimals);

        console.log("transfer to accounts[0]...")
        tx = walletcontract.transfer(
            USDC,
            accounts[0].address,
            transferAmount.toString()
        )

        console.log("smart wallet USDC after: ", await usdc.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("account[0] USDC: ", await usdc.balanceOf(accounts[0].address) / USDC_decimals);


        expect(await usdc.balanceOf(accounts[0].address)).gte(transferAmount.toString())
    })

    it("Deposit USDC into aave v2 and then withdraw", async () => {
        console.log("\n-----Test using aave: Deposit & withdraw USDC-----")

        //get some usdc into wallet
        const depositAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, depositAmount);

        console.log("Deposit...")
        tx = await walletcontract.aave_deposit(
            USDC,
            depositAmount.toString()
        )

        //check atoken balance. if deposit successful, atoken amount should not be 0
        const USDC_aTOKEN_ADDR = '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F';
        const atokenContract = await ethers.getContractAt("IERC20", USDC_aTOKEN_ADDR)
        let atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", await usdc.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("atoken balance of smart wallet = ", atokenBalance);
        expect(atokenBalance).to.be.greaterThan(0);

        //withdraw
        console.log("Withdraw...")
        tx = await walletcontract.aave_withdraw(USDC, depositAmount.toString());

        //check atoken balance. should be 0 or close to it
        atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", await usdc.balanceOf(walletcontract.address) / USDC_decimals);
        console.log("atoken balance after withdraw: ", atokenBalance)
        expect(atokenBalance).lessThanOrEqual(1n);
        //sometimes you already accrue 10^-6 USDC interest during this test, so use a tiny value instead of 0


        //check allowance of aave lending pool. should be 0.
        const allowance_USDC = await usdc.allowance(WHALE, aaveLendingPoolAddr);
        console.log("allowance: ", allowance_USDC);
        expect(allowance_USDC).to.equal(0);

    })



})
