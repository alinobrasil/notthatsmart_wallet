import { View, Text, Image, Button, ScrollView } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import TitleText from '../../components/TitleText'
import { SIZES, COLORS } from '../../constants/theme'
import Dropdown from '../../components/Dropdown';
import AmountInput from '../../components/AmountInput';
import ButtonCTA from '../../components/ButtonCTA';
import AppContext from '../../context';
import { ethers } from 'ethers';
import { CleanNumber } from '../../utils/calculations';
import { tokens } from '../../constants/assets';
import { getAmountOut } from '../../utils/uniswapQuotes';
import { debounce } from 'lodash'; // Import the lodash library
import IERC20Artifact from '../../constants/artifacts/IERC20.json';
import ERC20Artifact from '../../constants/artifacts/ERC20.json';

const TradeAmount = ({ route, navigation }) => {
    const symbol = route.params.symbol;
    const action = route.params.action;

    const [buyToken, setBuyToken] = useState()
    const [buyAmount, setBuyAmount] = useState(0)

    const [sellToken, setSellToken] = useState()
    const [sellAmount, setSellAmount] = useState(0)
    const [sellTokenBalance, setSellTokenBalance] = useState(0)

    //update sellAmount 1 second after user stop typing
    const dbSetSellAmount = debounce((text) => {
        setSellAmount(text);
    }, 1000);

    const [nativeBalance, setNativeBalance] = useState(0)
    const [walletWMATIC, setWalletWMATIC] = useState(0)

    const context = useContext(AppContext);
    const { provider, signer, wallet } = context;


    const getWalletBalance = async () => {
        const wmatic = new ethers.Contract(
            tokens.wmatic.address,
            IERC20Artifact.abi,
            provider
        )

        let wmaticBalance = await wmatic.balanceOf(wallet.address);
        wmaticBalance = ethers.utils.formatEther(wmaticBalance.toString())
        console.log("wallet WMATIC balance: ", wmaticBalance)
        setWalletWMATIC(wmaticBalance)
    }

    const getSellTokenBalance = async () => {
        const sellTokenContract = new ethers.Contract(
            tokens[sellToken.toLowerCase()].address,
            ERC20Artifact.abi,
            provider
        )

        let sellTokenBalance = await sellTokenContract.balanceOf(wallet.address);
        let sellTokenDecimals = await sellTokenContract.decimals();
        console.log("sellTokenDecimals", sellTokenDecimals)
        sellTokenBalance = ethers.utils.formatUnits(sellTokenBalance.toString(), sellTokenDecimals)
        sellTokenBalance = sellTokenBalance.toString()
        console.log("wallet", sellToken, "balance: ", sellTokenBalance)
        setSellTokenBalance(sellTokenBalance)
    }

    const getNativeBalance = async () => {
        let balance = await signer.getBalance();
        // console.log(balance)
        balance = CleanNumber(balance.toString())
        console.log("accounts0 balance:", balance, "MATIC")
        setNativeBalance(balance)
    }


    // If user specified buy token, then it's the symbol passed in. otherwise, use "WBTC"
    const getDefaultBuyToken = () => {
        if (action === "buy") {
            return symbol
        } else if (symbol === "WBTC") {
            return "WETH"
        } else {
            return "WBTC"
        }
    }

    // If user specified sell token, then it's the symbol passed in. otherwise, use "WMATIC"
    const getDefaultSellToken = () => {
        if (action === "sell") {
            return symbol
        } else if (symbol === "WMATIC") {
            return "USDT"
        } else {
            return "WMATIC"
        }
    }

    const executeTrade = async () => {
        //if it's ok to execute trade, then execute trade
        console.log("executing trade ....")

        try {
            let tx = await wallet.swapExactInputSingle(
                ethers.utils.parseEther(sellAmount.toString()),
                tokens[sellToken.toLowerCase()].address,
                tokens[buyToken.toLowerCase()].address
            );

            console.log(tx);

            const boughtToken = new ethers.Contract(
                tokens[buyToken.toLowerCase()].address,
                ERC20Artifact.abi,
                provider
            )

            const boughtTokenDecimals = await boughtToken.decimals();
            const boughtTokenSymbol = await boughtToken.symbol();

            let boughtTokenBalance = await boughtToken.balanceOf(wallet.address);
            boughtTokenBalance = ethers.utils.formatUnits(boughtTokenBalance.toString(), boughtTokenDecimals)
            console.log("bought token balance: ", boughtTokenBalance, boughtTokenSymbol)

            checkBalances(); //just to show display on screen

            navigation.navigate(
                "TradeConfirmed",
                {
                    paidAmount: sellAmount,
                    paidToken: sellToken,
                    receivedAmount: buyAmount,
                    receivedToken: buyToken,
                })

        } catch (e) {
            console.log(e)
        }

        console.log("...the end")
    }

    const checkBalances = () => {
        getNativeBalance();
        getWalletBalance();
    }



    useEffect(() => {
        //initialize buy and sell tokens
        if (action === "buy") {
            setBuyToken(symbol)
            setSellToken(getDefaultSellToken())
        } else {
            setSellToken(symbol)
            setBuyToken(getDefaultBuyToken())
        }

        getNativeBalance();

        //show wallet balance
        getWalletBalance();

    }, []);

    //Fetch swap prices
    useEffect(() => {
        const fetchSwapPrices = async () => {
            try {
                console.log("\n\n------------")
                console.log("Sell: ", sellToken, sellAmount);
                console.log("Buy: ", buyToken, buyAmount);
                if (sellAmount > 0 && sellToken !== buyToken) {
                    const amountOut = await getAmountOut(
                        tokens[sellToken.toLowerCase()].address,
                        tokens[buyToken.toLowerCase()].address,
                        sellAmount
                    );
                    setBuyAmount(Number(amountOut).toFixed(4));
                }
            } catch (e) {
                console.log(e);
            }
        };

        fetchSwapPrices();
    }, [sellAmount, sellToken, buyToken]);


    //update selltoken balance, only when user chooses a  different token to sell (Pay with)
    useEffect(() => {
        try {
            if (sellToken) {
                console.log("Selltoken changed to: ", sellToken)
                getSellTokenBalance();
            }
        } catch (e) {
            console.log(e)
        }
    }, [sellToken])



    return (

        <ScrollView style={{
            padding: 40,
            paddingTop: 0,
        }}>
            <TitleText theText="Trade" />
            <Text style={{
                fontSize: SIZES.font,
                color: COLORS.blue,
                marginTop: 20,
            }}
            >
                Please specify either the amount you wish to buy or amount you wish to pay:
            </Text>

            <View style={{ padding: 20 }}>
                <Text style={{
                    marginTop: 30,
                    fontSize: SIZES.font,
                    color: COLORS.blue,
                    fontWeight: 'bold',
                }}>
                    Token & Amount To Buy:
                </Text>


                <View style={{ flexDirection: 'row' }}>
                    <AmountInput setAmount={setBuyAmount} width={160} inputAmount={buyAmount} />
                    <Dropdown selectedItem={getDefaultBuyToken()} setItem={setBuyToken} />
                </View>

                <Text style={{
                    marginTop: 60,
                    fontSize: SIZES.font,
                    color: COLORS.blue,
                    fontWeight: 'bold',
                }}>
                    Token & Amount To Pay:
                </Text>

                <View style={{ flexDirection: 'row', }}>
                    <AmountInput setAmount={dbSetSellAmount} width={160} inputAmount={sellAmount} />
                    <Dropdown selectedItem={getDefaultSellToken()} setItem={setSellToken} />
                </View>

                <Text style={{
                    marginLeft: 10,
                }}>
                    Your have {sellTokenBalance} {sellToken} available.
                </Text>

            </View>

            <ButtonCTA label="Execute Trade" handlePress={executeTrade} />

        </ScrollView>

    )
}

export default TradeAmount