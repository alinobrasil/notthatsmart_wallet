const axios = require('axios').default
const { ethers } = require("ethers");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: QuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const { abi: factoryAbi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

const POLYGONSCAN_KEY = require('../key.js').POLYGONSCAN_KEY
const POLYGON_URL = require('../key.js').POLYGON_URL

const ERC20ABI = require('../constants/artifacts/ERC20.json').abi

// const AppContext = require('../context');
// const context = useContext(AppContext);
// const { provider, signer } = context;

const { tokens } = require('../constants/assets')

const provider = new ethers.providers.JsonRpcProvider(POLYGON_URL)

// const poolAddress = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed'




const getPoolAddress = async (token0Address, token1Address, poolBips = 3000) => {

    // The variables you need to plug in first.
    // If you dont know how to get these, see the extra info listed under this code snippet.
    // const token0Address = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
    // const token1Address = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6';
    const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
    // const factoryAbi = [...];  
    // const poolBips = 3000;  // 0.3%. This is measured in hundredths of a bip

    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);


    let poolAddress = await factoryContract.functions.getPool(token0Address, token1Address, poolBips);
    poolAddress = poolAddress.toString()


    return poolAddress
}


const getAmountOut = async (inputTokenAddress, outputTokenAddress, inputAmount, poolBips = 3000) => {

    const poolAddress = await getPoolAddress(inputTokenAddress, outputTokenAddress)
    console.log("poolAddress", poolAddress);

    // // console.log("getting pool contract instance...")
    // const poolContract = new ethers.Contract(
    //     poolAddress,
    //     IUniswapV3PoolABI,
    //     provider
    // )

    // let token0Address = inputTokenAddress
    // let token1Address = outputTokenAddress;

    // const immutables = await getPoolImmutables(poolContract)

    // let token0 = token0Address
    // let tokenDecimals = tokenDecimals0
    // let token1 = token1Address;

    // // get token0 and token1 right
    // if (immutables.token0 !== token0Address) {
    //     token0 = token1Address;
    //     tokenDecimals = tokenDecimals1
    //     token1 = token0Address;
    // }



    // const tokenContract0 = new ethers.Contract(
    //     token0Address,
    //     ERC20ABI,
    //     provider
    // )
    // const tokenContract1 = new ethers.Contract(
    //     token1Address,
    //     ERC20ABI,
    //     provider
    // )

    const inputTokenContract = new ethers.Contract(
        inputTokenAddress,
        ERC20ABI,
        provider
    )

    const inputTokenSymbol = await inputTokenContract.symbol()
    const inputTokenDecimals = await inputTokenContract.decimals()

    const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        inputTokenDecimals
    )

    const outputTokenContract = new ethers.Contract(
        outputTokenAddress,
        ERC20ABI,
        provider
    )

    const outputTokenDecimals = await outputTokenContract.decimals()
    const outputTokenSymbol = await outputTokenContract.symbol()



    // const tokenSymbol0 = await tokenContract0.symbol()
    // const tokenSymbol1 = await tokenContract1.symbol()
    // const tokenDecimals0 = await tokenContract0.decimals()
    // const tokenDecimals1 = await tokenContract1.decimals()

    // console.log("tokenDecimals0: ", tokenDecimals0)
    // console.log("tokenDecimals1: ", tokenDecimals1)

    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"
    const quoterContract = new ethers.Contract(
        quoterAddress,
        QuoterABI,
        provider
    )

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        inputTokenAddress, //tokenIn
        outputTokenAddress, //tokenOut
        poolBips,
        amountIn,
        0
    )

    const amountOut = ethers.utils.formatUnits(quotedAmountOut, outputTokenDecimals)

    console.log('=========')
    console.log(`${inputAmount} ${inputTokenSymbol} can be swapped for ${amountOut} ${outputTokenSymbol}`)
    console.log('=========')

    return amountOut

}

const getPoolImmutables = async (poolContract) => {
    const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
    ])

    const immutables = {
        token0: token0,
        token1: token1,
        fee: fee
    }

    return immutables
}

export { getAmountOut, getPoolAddress }
