const { ethers } = require('hardhat');
const hre = require('hardhat')

const USDC_CONTRACT = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const USDC_WHALE = '0xf9211FfBD6f741771393205c1c3F6D7d28B90F03';
const SMART_WALLET_ADDRESS = '0xeC20dCBf0380F1C9856Ee345aF41F62Ee45a95a1';


async function main() {
    console.log("\nstarting script...")
    const usdcToken = await ethers.getContractAt("IERC20", USDC_CONTRACT);
    const amountToDeposit = "1000000000"  //1000 usdc plus 6 decimals

    console.log(`address of USDC contract: ${USDC_CONTRACT}`)

    const whale_balance = await usdcToken.balanceOf(USDC_WHALE);
    console.log("USDC Whale balance: ", formatCurrency(whale_balance / 1000000));
    console.log(`About to transfer this much:   ${formatCurrency(amountToDeposit / 1000000)}`)

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [USDC_WHALE],
    });
    const signer = await ethers.getSigner(USDC_WHALE);

    const impersonatedSigner = await ethers.getImpersonatedSigner(USDC_WHALE);

    console.log("Transferring....")

    const tx = await usdcToken
        .connect(impersonatedSigner)
        .transfer(SMART_WALLET_ADDRESS, amountToDeposit);
    tx.wait()

    // console.log(tx)
    console.log(`smart wallet balance:  ${await usdcToken.balanceOf(SMART_WALLET_ADDRESS)}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = "0";
    }

    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10) {
        cents = "0" + cents;
    }
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}