const { expect } = require("chai")
const { ethers, network } = require("hardhat")
const BigNumber = require("bignumber.js");

// function convenient for formatting big numbers
function CleanNum(amount, decimals = 18) {

    numerator = new BigNumber(amount.toString());
    denominator = new BigNumber(10 ** decimals);
    cleanNum = numerator.dividedBy(denominator).toString();
    cleanNum = Number(cleanNum).toFixed(2);
    cleanNum = cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return cleanNum

}

// These are on polygon mainnet
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const WETH9 = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"; //WMATIC
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const CRV = "0x172370d5Cd63279eFa6d502DAB29171933a610AF";
const BLOK = "0x229b1b6C23ff8953D663C4cBB519717e323a0a84"

const WHALE = '0x06959153B974D0D5fDfd87D561db6d8d4FA0bb0B';

const aaveLendingPoolAddr = '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf';

const USDC_aTOKEN_ADDR = '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F';


describe("Testing Smart wallet....", () => {
    let accounts
    let whale_signer;
    let walletcontract;

    const amountIn = 10n * 10n ** 18n;
    const provider = new ethers.providers.Web3Provider(network.provider);

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
        console.log("smartWallet WMATIC balance: ", CleanNum(wethBalance), "WMATIC")

    })

    // //basic wallet function: send/receive
    it("Receive native MATIC", async () => {
        console.log("\n----- Receive native MATIC into wallet -------");
        const [signer] = await ethers.getSigners();
        await signer.sendTransaction({
            to: walletcontract.address,
            value: ethers.utils.parseEther("2")
        })

        //should automatically get converted to WMATIC

        let walletBalance = await provider.getBalance(walletcontract.address)
        console.log("Wallet MATIC balance: ", CleanNum(walletBalance))

        let accountBalance = await provider.getBalance(accounts[0].address)
        console.log("accounts[0] MATIC balance: ", CleanNum(accountBalance))

        let wethBalance = await weth.balanceOf(walletcontract.address);
        console.log("smartWallet WMATIC balance: ", CleanNum(wethBalance), "WMATIC")

        expect(CleanNum(wethBalance)).to.equal("2.00")
    })

    // // no longer testing this. Smart wallet will not hold native MATIC.
    // // all MATIC received will be converted to WMATIC
    // it("Send native MATIC to someone", async () => {

    //     console.log("\n-----Send/withdraw native MATIC from wallet -------");

    //     // amount to send
    //     const amountOut = 1

    //     let startingBalance = await provider.getBalance(walletcontract.address)
    //     console.log("starting wallet balance: ", CleanNum(startingBalance))

    //     let accountBalance = await provider.getBalance(accounts[1].address)
    //     console.log("starting accounts1 balance: ", CleanNum(accountBalance))

    //     // withdraw to accounts[1]
    //     await walletcontract.withdraw(ethers.utils.parseEther(amountOut.toString()), accounts[1].address);

    //     let endingBalance = await provider.getBalance(walletcontract.address)
    //     console.log("Ending wallet balance: ", CleanNum(endingBalance))

    //     accountBalance = await provider.getBalance(accounts[1].address)
    //     console.log("Ending accounts1 balance: ", CleanNum(accountBalance))

    //     expect(CleanNum(startingBalance) - CleanNum(endingBalance)).to.equal(amountOut)

    // })

    it("Unauthorized attempt of sending native MATIC", async () => {
        console.log("\nUnauthorized attempt of sending native MATIC ------------")
        const amountOut = 1


        await expect(walletcontract
            .connect(accounts[3])
            .withdraw(ethers.utils.parseEther(amountOut.toString()), accounts[1].address)
        ).to.be.revertedWith('Must be Owner')


    })

    it("move tokens out of smart wallet (transfer)", async () => {
        console.log("\n---------Move tokens out of smart wallet-----")

        //load up some USDC in smart contract
        const transferAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, transferAmount);
        let usdcBalance = await usdc.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", CleanNum(usdcBalance, 6));

        console.log("transfer to accounts[0]...")
        tx = walletcontract.transfer(
            USDC,
            accounts[0].address,
            transferAmount.toString()
        )
        usdcBalance = await usdc.balanceOf(walletcontract.address)
        console.log("smart wallet USDC after: ", CleanNum(usdcBalance, 6));

        let accountBalance = await usdc.balanceOf(accounts[0].address)
        console.log("accounts[0] USDC: ", CleanNum(accountBalance, 6));

        expect(await usdc.balanceOf(accounts[0].address)).gte(transferAmount.toString())
    })

    it("Unauthorized transfer", async () => {
        console.log("\nUnauthorized transfer -----")

        //load up some USDC in smart contract
        const transferAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, transferAmount);
        let usdcBalance = await usdc.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", CleanNum(usdcBalance, 6));

        await expect(walletcontract
            .connect(accounts[3])
            .transfer(
                USDC,
                accounts[0].address,
                transferAmount.toString()
            )).to.be.revertedWith('Only the owner can transfer tokens')
    })

    // //Swap functionality (uniswap)
    // it("swap WMATIC to DAI", async () => {
    //     console.log("\n-----Testing Swap: WMATIC to DAI-----")

    //     //send some weth (WMATIC) to accounts[0]
    //     await weth
    //         .connect(whale_signer)
    //         .transfer(walletcontract.address, amountIn);
    //     let wethBalance = await weth.balanceOf(walletcontract.address);
    //     console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

    //     let daiBalance = await dai.balanceOf(walletcontract.address);
    //     console.log("Starting Dai balance: ", daiBalance.toString(), "DAI")

    //     //execute trade. WMATIC --> dai
    //     await walletcontract.swapExactInputSingle(
    //         amountIn,
    //         WETH9,
    //         DAI)
    //     daiBalance = await dai.balanceOf(walletcontract.address)
    //     console.log("new Dai balance: ", CleanNum(daiBalance), "DAI")

    // })

    it("Unauthorized swap", async () => {
        console.log("\nUnauthorized swap-----")

        //send some weth (WMATIC) to accounts[0]
        await weth
            .connect(whale_signer)
            .transfer(walletcontract.address, amountIn);

        //     let wethBalance = await weth.balanceOf(walletcontract.address);
        // console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

        // let daiBalance = await dai.balanceOf(walletcontract.address);
        // console.log("Starting Dai balance: ", daiBalance.toString(), "DAI")

        //execute trade. WMATIC --> dai
        await expect(walletcontract
            .connect(accounts[4])
            .swapExactInputSingle(
                amountIn,
                WETH9,
                DAI)).to.be.revertedWith('Must be owner')

    })



    // it("Swap WMATIC to BLOK", async function () {
    //     console.log("\n-----Testing Swap: WMATIC to BLOK-----")
    //     //send some weth (WMATIC) to accounts[0]
    //     await weth
    //         .connect(whale_signer)
    //         .transfer(walletcontract.address, amountIn);
    //     let wethBalance = await weth.balanceOf(walletcontract.address);
    //     console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

    //     let blokBalance = await blok.balanceOf(walletcontract.address);
    //     console.log("Starting BLOK balance: ", CleanNum(blokBalance))

    //     //execute trade. WMATIC --> dai
    //     await walletcontract.swapExactInputSingle(
    //         amountIn,
    //         WETH9,
    //         BLOK)

    //     blokBalance = await blok.balanceOf(walletcontract.address);
    //     console.log("Blok balance after swap: ", CleanNum(blokBalance))
    //     expect(blokBalance).to.be.greaterThan(0)

    //     //show WMATIC balance after swap
    //     wethBalance = await weth.balanceOf(walletcontract.address);
    //     console.log("WMATIC balance after swap: ", CleanNum(wethBalance))

    // })

    it("Swap USDC to DAI", async function () {
        console.log("\n-----Testing Swap: USDC to DAI-----")

        const usdcAmount = 10 * 10 ** 6
        await usdc
            .connect(whale_signer)
            .transfer(walletcontract.address, usdcAmount);
        let usdcBalance = await usdc.balanceOf(walletcontract.address);
        console.log("starting USDC balance: ", CleanNum(usdcBalance, 6))

        let daiBalance = await dai.balanceOf(walletcontract.address);
        console.log("Starting Dai balance: ", CleanNum(daiBalance), "DAI")

        //execute trade. WMATIC --> dai
        await walletcontract
            .connect(accounts[0])
            .swapExactInputSingle(
                usdcAmount.toString(),
                USDC,
                DAI);

        //check dai balance
        daiBalance = await dai.balanceOf(walletcontract.address)
        console.log("Dai balance after swap: ", CleanNum(daiBalance), " DAI")
        expect(daiBalance).to.be.greaterThan(0)

        //show USDC balance after swap
        usdcBalance = await usdc.balanceOf(walletcontract.address);
        console.log("USDC balance after swap: ", CleanNum(usdcBalance, 6))
    })

    // it("Swap CRV to WMATIC", async function () {
    //     console.log("\n-----Testing Swap: CRV to WMATIC-----")

    //     //send some crv to accounts[0]
    //     await crv
    //         .connect(whale_signer)
    //         .transfer(walletcontract.address, amountIn);
    //     let crvBalance = await crv.balanceOf(walletcontract.address);
    //     console.log("Starting CRV balance: ", CleanNum(crvBalance))

    //     let wethBalance = await weth.balanceOf(walletcontract.address);
    //     console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

    //     console.log("execute swap.....")
    //     //execute trade. WMATIC --> dai
    //     await walletcontract.swapExactInputSingle(
    //         amountIn,
    //         CRV,
    //         WETH9)

    //     crvBalance = await crv.balanceOf(walletcontract.address);
    //     console.log("final CRV balance: ", CleanNum(crvBalance))


    //     wethBalance = await weth.balanceOf(walletcontract.address);
    //     console.log("final WMATIC balance: ", CleanNum(wethBalance))


    // })

    // "Save" functionality: Aave
    it("Deposit USDC into aave v2 ", async () => {
        console.log("\n-----Test using aave: Deposit & withdraw USDC-----")

        //get some usdc into wallet
        const depositAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, depositAmount);

        // console.log("Deposit...")
        tx = await walletcontract.aave_deposit(
            USDC,
            depositAmount.toString()
        )

        //check atoken balance. if deposit successful, atoken amount should not be 0

        const atokenContract = await ethers.getContractAt("IERC20", USDC_aTOKEN_ADDR)
        let atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        let usdcBalance = await usdc.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", CleanNum(usdcBalance, 6));
        console.log("atoken balance of smart wallet = ", CleanNum(atokenBalance, 6));
        expect(atokenBalance).to.be.greaterThan(0);

        //check allowance of aave lending pool. should be 0.
        const allowance_USDC = await usdc.allowance(walletcontract.address, aaveLendingPoolAddr);
        console.log("allowance after whole operation: ", allowance_USDC);
        expect(allowance_USDC).to.equal(0);

    })

    // "Save" functionality: Aave
    it("Unauthrozied deposit", async () => {
        console.log("\nUnauthorized deposit attempt-----")

        //get some usdc into wallet
        const depositAmount = 100n * 10n ** 6n
        await usdc.connect(whale_signer)
            .transfer(walletcontract.address, depositAmount);


        await expect(walletcontract
            .connect(accounts[4])
            .aave_deposit(
                USDC,
                depositAmount.toString()
            )).to.be.revertedWith("Must be owner")

    })

    it("Withdraw USDC from Aave v2", async () => {
        console.log("\n------Test withdraw from aave ------------")

        const depositAmount = 100n * 10n ** 6n  //amount from the deposit test
        const atokenContract = await ethers.getContractAt("IERC20", USDC_aTOKEN_ADDR)
        //withdraw

        tx = await walletcontract.aave_withdraw(USDC, depositAmount.toString());

        //check atoken balance. should be 0 or close to it
        let atokenBalance = await atokenContract.balanceOf(walletcontract.address)
        let usdcBalance = await usdc.balanceOf(walletcontract.address)
        console.log("smart wallet USDC: ", CleanNum(usdcBalance, 6));
        console.log("atoken balance after withdraw: ", CleanNum(atokenBalance, 6))
        expect(atokenBalance).lessThanOrEqual(2n);
        //sometimes you already accrue 10^-6 USDC interest during this test, so use a tiny value instead of 0
    })

    it("Unauthorized withdraw", async () => {
        console.log("\nUnauthorized withdraw from aave ------------")

        const depositAmount = 100n * 10n ** 6n  //amount from the deposit test
        const atokenContract = await ethers.getContractAt("IERC20", USDC_aTOKEN_ADDR)
        //withdraw

        await expect(walletcontract
            .connect(accounts[3])
            .aave_withdraw(USDC, depositAmount.toString())).to.be.revertedWith("Must be owner")
    })

    // Invest (passive income - LP - Quickswap)
    it("Add liquidity to MATIC/CRV pool", async () => {
        console.log("\n---------Test adding liquidity -------");

        //first, give the wallet some tokens
        const amountA = 20n * 10n ** 18n
        await weth.connect(whale_signer).transfer(walletcontract.address, amountA);

        const amountB = amountA
        await crv.connect(whale_signer).transfer(walletcontract.address, amountB)

        let wethBalance = await weth.balanceOf(walletcontract.address);
        console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

        let crvBalance = await crv.balanceOf(walletcontract.address);
        console.log("starting CRV balance: ", CleanNum(crvBalance))

        console.log("add liquidity...")

        //add liquidity
        await walletcontract.addLiquidity(
            WETH9,
            CRV,
            amountA,
            amountB
        )

        //show balances after adding liquidity
        wethBalance = await weth.balanceOf(walletcontract.address);
        console.log("Ending WMATIC balance: ", CleanNum(wethBalance))
        crvBalance = await crv.balanceOf(walletcontract.address);
        console.log("Ending CRV balance: ", CleanNum(crvBalance))

        //check LP token balance
        const factoryContract = await ethers.getContractAt("IUniswapV2Factory", "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32");
        const PAIR = await factoryContract.getPair(WETH9, CRV);
        console.log("Pair address: ", PAIR)

        const pairToken = await ethers.getContractAt("IUniswapV2Pair", PAIR);
        const pairBalance = await pairToken.balanceOf(walletcontract.address)

        console.log("LP token balance: ", CleanNum(pairBalance));
        expect(pairBalance).to.be.greaterThan(0);

    })

    // This test fails if combined with some of the swap tests above.
    // probably related to the tracking of lending pool size
    // no conflict with usdc/dai swap 
    it("Unauthorized attempt to Add liquidity to MATIC/CRV pool", async () => {
        console.log("\nUnauthorized attempt adding liquidity -------");

        //first, give the wallet some tokens
        const amountA = 10n * 10n ** 18n
        await weth.connect(whale_signer).transfer(walletcontract.address, amountA);

        const amountB = amountA
        await crv.connect(whale_signer).transfer(walletcontract.address, amountB)

        let wethBalance = await weth.balanceOf(walletcontract.address);
        console.log("Starting WMATIC balance: ", CleanNum(wethBalance))

        let crvBalance = await crv.balanceOf(walletcontract.address);
        console.log("starting CRV balance: ", CleanNum(crvBalance))

        console.log("add liquidity...")

        //add liquidity
        await expect(
            walletcontract
                .connect(accounts[1])
                .addLiquidity(
                    WETH9,
                    CRV,
                    amountA,
                    amountB
                )
        ).to.be.revertedWith("Must be owner")
    })


    it("Unauthorized Remove liquidity", async () => {
        console.log("\n-----Unauthorized attempt at removing liquidity ----------")
        const factoryContract = await ethers.getContractAt("IUniswapV2Factory", "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32");
        const PAIR = await factoryContract.getPair(WETH9, CRV);
        const pairToken = await ethers.getContractAt("IUniswapV2Pair", PAIR);
        let pairBalance = await pairToken.balanceOf(walletcontract.address)

        console.log("Starting balances:")
        console.log("starting USDC/DAI LP token: ", CleanNum(pairBalance));
        expect(pairBalance).to.be.greaterThan(0);
        console.log("WMATIC balance: ", CleanNum(await weth.balanceOf(walletcontract.address)));
        console.log("CRV balance: ", CleanNum(await crv.balanceOf(walletcontract.address)));

        //remove liquidity
        await expect(walletcontract
            .connect(accounts[3])
            .removeLiquidity(weth.address, crv.address)).to.be.revertedWith("Must be owner")

    })

    it("Remove liquidity", async () => {
        console.log("\n------- Test removing liquidity ----------")
        const factoryContract = await ethers.getContractAt("IUniswapV2Factory", "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32");
        const PAIR = await factoryContract.getPair(WETH9, CRV);
        const pairToken = await ethers.getContractAt("IUniswapV2Pair", PAIR);
        let pairBalance = await pairToken.balanceOf(walletcontract.address)



        console.log("Starting balances:")
        console.log("starting USDC/DAI LP token: ", CleanNum(pairBalance));
        expect(pairBalance).to.be.greaterThan(0);
        console.log("WMATIC balance: ", CleanNum(await weth.balanceOf(walletcontract.address)));
        console.log("CRV balance: ", CleanNum(await crv.balanceOf(walletcontract.address)));

        //remove liquidity
        await walletcontract.removeLiquidity(weth.address, crv.address)

        console.log("Ending balances:")
        console.log("WMATIC balance: ", CleanNum(await weth.balanceOf(walletcontract.address)));
        console.log("CRV balance: ", CleanNum(await crv.balanceOf(walletcontract.address)));
        pairBalance = await pairToken.balanceOf(walletcontract.address)
        console.log("USDC/DAI LP token: ", CleanNum(pairBalance));
        expect(pairBalance).to.equal(0)



    })




})





