require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" })


module.exports = {
    solidity: "0.6.12",
    networks: {
        goerli: {
            url: process.env.ALCHEMY_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
        mumbai: {
            url: process.env.POLYGON_MUMBAI_URL,
            accounts: [process.env.PRIVATE_KEY]
        },
        polygonFork: {
            url: "http://localhost:8545",
            accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
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

