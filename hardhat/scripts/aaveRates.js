require('dotenv').config({ path: ".env" })
const { ethers } = require('hardhat')
const {
    UiPoolDataProvider,
    UiIncentiveDataProvider,
    ChainId,
} = require('@aave/contract-helpers');
const { formatReserves } = require('@aave/math-utils');
const dayjs = require('dayjs');

// provider address on v3, polygon
const uiPoolDataProviderAddress = "0xC69728f11E9E6127733751c8410432913123acf1";
const lendingPoolAddressProvider = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"

const provider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_MAINNET_URL,
);

const poolDataProviderContract = new UiPoolDataProvider({
    uiPoolDataProviderAddress,
    provider,
    chainId: ChainId.mainnet,
});

async function getReserves() {

    const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider,
    });

    const reservesArray = reserves.reservesData;

    const baseCurrencyData = reserves.baseCurrencyData;

    const currentTimestamp = dayjs().unix();

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
    const reserves = await getReserves();


}