const { ethers } = require('hardhat')


async function main() {

    const MyContract = await ethers.getContractFactory("Wallet");
    const contract = await MyContract.attach(
        "0xFF0693EF110B712af852f84a6D8fDfAC3881dCd6" // The deployed contract address
    );

    // Verify the contract after deploying
    await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [],
    });
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })