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
        },
        polygonfork: {
            // local test node, forking mainnet via alchemy rpc url
            url: 'http://localhost:8545',
            // hardhat accounts
            accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
                '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d']
            // accounts: ['0x761a23b28a0b8e1126d5953cd72001f34f143ae00eee4d3995cadbe1f85b2c71',
            //     '0x15b7448cc2f787c3ebb00e787600fcdbf4130b976b3264e95330f1a4aa56dde2'     ]

        }
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env.POLYGONSCAN_KEY,
            goerli: process.env.ETHERSCAN_KEY
        }
    }
}

