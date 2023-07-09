import aavelogo from '../assets/tokenlogo/aave.png'
import atomlogo from '../assets/tokenlogo/atom.png'
import crvlogo from '../assets/tokenlogo/crv.png'
import dailogo from '../assets/tokenlogo/dai.png'
import linklogo from '../assets/tokenlogo/link.png'
import maticlogo from '../assets/tokenlogo/matic.png'
import usdclogo from '../assets/tokenlogo/usdc.png'
import usdtlogo from '../assets/tokenlogo/usdt.png'
import wbtclogo from '../assets/tokenlogo/wbtc.png'
import wethlogo from '../assets/tokenlogo/weth.png'


const tokens = {
    aave: {
        address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        image: aavelogo,
        description: "Token of the largest defi protocol",
        decimals: 18
    },
    // atom: {
    //     address: "0xac51C4c48Dc3116487eD4BC16542e27B5694Da1b",
    //     image: atomlogo,
    //     description: "Token powering the Cosmos ecosystem"
    // },
    // crv: {
    //     address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
    //     image: crvlogo,
    //     description: `Biggest crypto "bonds" distributor in DeFi`
    // },
    dai: {
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        image: dailogo,
        description: "Largest algorithmic stablecoin",
        decimals: 18
    },
    // link: {
    //     address: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    //     image: linklogo,
    //     description: "Powers the largest oracle network"
    // },
    wmatic: {
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        image: maticlogo,
        description: "Used for transactions on the Polygon network",
        decimals: 18
    },
    usdc: {
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        image: usdclogo,
        description: "Stablecoin issued by Circle",
        decimals: 6
    },
    usdt: {
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        image: usdtlogo,
        description: "Stablecoin issued by Tether",
        decimals: 6
    },
    wbtc: {
        address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        image: wbtclogo,
        description: "Bitcoin that can be traded on Ethereum",
        decimals: 18
    },
    weth: {
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        image: wethlogo,
        description: "The 2nd largest crypto",
        decimals: 18
    },
}


const aPolTokens = [
    {
        name: "aPolWeth",
        address: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8",
        description: "Atoken for WETH",
        description: "Aave Polygon WETH",
        decimals: 18
    }
]

// const addresses = {
//     USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
//     DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
//     WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
//     CRV: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
//     WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
//     WBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
//     USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
//     ATOM: "0xac51C4c48Dc3116487eD4BC16542e27B5694Da1b",
//     LINK: "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
//     AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B"
// }


export {
    tokens,
    // addresses,
    aPolTokens,
    wethlogo,
}
