require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" })

const DEFAULT_COMPILER_SETTINGS = {
    version: '0.7.6',
    settings: {
        evmVersion: 'istanbul',
        optimizer: {
            enabled: true,
            runs: 1_000_000,
        },
        metadata: {
            bytecodeHash: 'none',
        },
    },
}

module.exports = {
    solidity: {
        compilers: [DEFAULT_COMPILER_SETTINGS],

    },
    networks: {
        goerli: {
            url: process.env.ALCHEMY_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
        mumbai: {
            url: process.env.POLYGON_MUMBAI_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        hardhat: {
            forking: {
                url: process.env.POLYGON_MAINNET_URL,
            },
        }
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_KEY,
            goerli: process.env.ETHERSCAN_KEY
        }
    }
}

