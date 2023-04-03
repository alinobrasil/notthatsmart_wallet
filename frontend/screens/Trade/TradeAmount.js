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


const TradeAmount = ({ route }) => {
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

    const context = useContext(AppContext);
    const { provider, signer } = context;

    // console.log(provider)

    const getNativeBalance = async () => {
        let balance = await signer.getBalance();
        // console.log(balance)
        balance = CleanNumber(balance.toString())
        console.log(balance)
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
        } else if (symbol === "USDC") {
            return "USDT"
        } else {
            return "USDC"
        }
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
        getNativeBalance()
    }, []);

    //Fetch swap prices
    useEffect(() => {
        const fetchSwapPrices = async () => {
            try {
                console.log("\n\nSell: ", sellToken, sellAmount);
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
                    <AmountInput setAmount={setBuyAmount} width={160} amount={buyAmount} />
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
                    <AmountInput setAmount={dbSetSellAmount} width={160} amount={sellAmount} />
                    <Dropdown selectedItem={getDefaultSellToken()} setItem={setSellToken} />
                </View>
            </View>


            {/* Just for checking state variables */}
            <Text style={{
                marginTop: 20,
            }}>
                Buy : {buyAmount} {buyToken}
            </Text>
            <Text>
                Sell : {sellAmount}  {sellToken}
            </Text>
            <Text>NativeBalance: {nativeBalance} </Text>

            <ButtonCTA label="Execute Trade" handlePress={() => { }} />

        </ScrollView>

    )
}

export default TradeAmount