const hre = require("hardhat");
const { ethers } = require('hardhat')

const WALLET_ADDRESS = '0xFF0693EF110B712af852f84a6D8fDfAC3881dCd6'
const CD_TOKEN_ADDRESS = '0x79397C5B252D862362e84f1e1aDC229ce85C55ff'
const RECIPIENT_ADDRESS = '0x42A2C59dCF95D804131C859A8382aC49d55b04bd'

async function main() {

    const walletContract = await ethers.getContractAt('Wallet', WALLET_ADDRESS);
    const cdBalance = await walletContract.balanceOf(CD_TOKEN_ADDRESS)

    console.log(`cd token balance:  ${cdBalance}`)

    const transfer_tx = await walletContract.transfer(
        CD_TOKEN_ADDRESS,
        RECIPIENT_ADDRESS,
        ethers.utils.parseUnits("0.1", "ether")
    )

    console.log(transfer_tx)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
