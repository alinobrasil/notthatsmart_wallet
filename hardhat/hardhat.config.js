require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" })


module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.7.6",
            },
            {
                version: "0.6.12",
            },
        ],
        // overrides: {
        //     "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol": {
        //         version: "0.6.12",
        //         settings: {}
        //     },
        //     "@aave/protocol-v2/contracts/protocol/libraries/types/DataTypes.sol": {
        //         version: "0.6.12",
        //         settings: {}
        //     },
        //     "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol": {
        //         version: "0.6.12",
        //         settings: {}
        //     },
        //     "@openzeppelin/contracts/token/ERC20/IERC20.sol": {
        //         version: "0.6.0",
        //         settings: {}
        //     }
        // }
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

