// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    console.log("Deploying....")

    let accounts = await ethers.getSigners();
    // console.log(accounts)

    const walletFactory = await hre.ethers.getContractFactory("Wallet");
    const walletcontract = await walletFactory.deploy();

    await walletcontract.deployed();

    console.log(
        `Wallet contract deployed to ${walletcontract.address}`
    );

    console.log(walletcontract.address.length)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
