// import dotenv from 'react-native-dotenv';
import "react-native-get-random-values"
// Pull in the shims (BEFORE importing ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from 'ethers';
import { UiPoolDataProvider, UiIncentiveDataProvider, ChainId } from '@aave/contract-helpers';
import { formatReserves } from '@aave/math-utils';
import dayjs from 'dayjs';

import { tokens } from '../constants/assets';
import Config from 'react-native-config';
// const POLYGON_MAINNET_URL = Config.POLYGON_MAINNET_URL;
const POLYGON_MAINNET_URL = "https://polygon-mainnet.g.alchemy.com/v2/mtrKHKGQYeNCmVnICdaKhmqko9eoDIRT"

// console.log("\n\n\n\n")
// console.log(POLYGON_MAINNET_URL)
// console.log("\n\n\n\n")

// provider address on v3, polygon
const uiPoolDataProviderAddress = "0xC69728f11E9E6127733751c8410432913123acf1";
const lendingPoolAddressProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"

const provider = new ethers.providers.JsonRpcProvider(
    POLYGON_MAINNET_URL,
);

// console.log(JSON.stringify(provider, null, 2))

function CleanNum(amount, decimals = 18) {
    let balance0 = ethers.utils.formatUnits(amount, decimals)
    balance0 = Number(balance0).toFixed(2)
    return balance0

}

const testProvider = async () => {
    try {
        console.log("\n\nTesting provider.......")
        const ACCOUNT0 = "0x1a706EB4F22FDc03EE4624cF195cD9dABED2C264"
        const ACCOUNT1 = '0x438E989d5eb3009caB3554D076415C7BBE845a48';
        let balance0 = await provider.getBalance(ACCOUNT0)
        console.log("Account0: ", CleanNum(balance0))

        let balance1 = await provider.getBalance(ACCOUNT1)
        console.log("account 1:", CleanNum(balance1))
    }
    catch (e) {
        console.log(e)
    }
}




const poolDataProviderContract = new UiPoolDataProvider({
    uiPoolDataProviderAddress,
    provider,
    chainId: 137,
});

async function getReserves() {

    console.log("Getting reserves data...")
    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider,
    });

    const reservesArray = reserves.reservesData;
    const baseCurrencyData = reserves.baseCurrencyData;

    const currentTimestamp = dayjs().unix();

    console.log("getting formatted pool reserves data")
    const formattedPoolReserves = formatReserves({
        reserves: reservesArray,
        currentTimestamp,
        marketReferenceCurrencyDecimals:
            baseCurrencyData.marketReferenceCurrencyDecimals,
        marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    });

    // console.log(formattedPoolReserves)
    return formattedPoolReserves
}

async function getRates() {
    console.log("Getting rates...")
    const reserves = await getReserves();

    // console.log(JSON.stringify(reserves, null, 2))

    let symbols = Object.keys(tokens)  //get list of symbols
    symbols = symbols.map(item => item.toUpperCase())
    // console.log("Symbols ", symbols)

    // console.log(symbols)

    // console.log(JSON.stringify(symbols, null, 2))

    // //only keep reserve info for whitelisted tokens
    let myList = reserves.filter(item => symbols.includes(item.symbol))

    // only keep needed fields
    myList = myList.map(item => {
        let newItem = {
            symbol: item.symbol,
            supplyAPY: item.supplyAPY
        }
        return newItem
    })

    let ratesTable = {}
    myList.forEach(item => {
        let theRate = parseFloat(item.supplyAPY) * 100
        theRate = theRate.toFixed(2)
        ratesTable[item.symbol] = theRate
    })

    // console.log(ratesTable)

    return ratesTable
}


export { getRates, getReserves, testProvider }