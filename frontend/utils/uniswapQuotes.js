const axios = require('axios').default
const { ethers } = require("ethers");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: QuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const { abi: factoryAbi } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

const POLYGON_URL = require('../key.js').POLYGON_URL

const ERC20ABI = require('../constants/artifacts/ERC20.json').abi

const provider = new ethers.providers.JsonRpcProvider(POLYGON_URL)

const getAmountOut = async (inputTokenAddress, outputTokenAddress, inputAmount, poolBips = 3000) => {

    const poolAddress = await getPoolAddress(inputTokenAddress, outputTokenAddress)
    console.log("poolAddress", poolAddress);

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

const getPoolAddress = async (token0Address, token1Address, poolBips = 3000) => {

    const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

    let poolAddress = await factoryContract.functions.getPool(token0Address, token1Address, poolBips);
    poolAddress = poolAddress.toString()
    return poolAddress
}


export { getAmountOut, getPoolAddress }
