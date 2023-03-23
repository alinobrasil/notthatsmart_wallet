import { View, Text, Image, Button, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import TitleText from '../../components/TitleText'
import { SIZES, COLORS } from '../../constants/theme'
import ModalDropdown from 'react-native-modal-dropdown';
import triangle from '../../assets/sort-down.png'
import Dropdown from '../../components/Dropdown';
import AmountInput from '../../components/AmountInput';
import ButtonCTA from '../../components/ButtonCTA';


const TradeAmount = ({ route }) => {
    const symbol = route.params.symbol;
    const action = route.params.action;

    const [buyToken, setBuyToken] = useState("")
    const [buyAmount, setBuyAmount] = useState(0)

    const [sellToken, setSellToken] = useState("")
    const [sellAmount, setSellAmount] = useState(0)

    // When user edits buy amount, calculate how much they'd have to pay based on current price
    const changedBuyAmount = (amount) => {

    }

    const changedSellAmount = (amount) => {
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

        if (action === "buy") {
            setBuyToken(symbol)
            setSellToken(getDefaultSellToken())
        } else {
            setSellToken(symbol)
            setBuyToken(getDefaultBuyToken())
        }
    }, []);



    return (

        <ScrollView style={{
            padding: 40,
            paddingTop: 0,
        }}>
            <TitleText theText="Trade" />
            <Text style={{
                fontSize: SIZES.font,
                color: COLORS.blue,
                marginTop: 30,
            }}
            >
                Please specify either the amount you wish to buy or amount you wish to pay:
            </Text>

            <View style={{ padding: 20 }}>
                <Text style={{
                    marginTop: 60,
                    fontSize: SIZES.font,
                    color: COLORS.blue,
                    fontWeight: 'bold',
                }}>
                    Token & Amount To Buy:
                </Text>


                <View style={{ flexDirection: 'row' }}>
                    <AmountInput setAmount={setBuyAmount} width={160} />
                    <Dropdown selectedItem={getDefaultBuyToken()} setItem={setBuyToken} />
                </View>

                <Text style={{
                    marginTop: 80,
                    fontSize: SIZES.font,
                    color: COLORS.blue,
                    fontWeight: 'bold',
                }}>
                    Token & Amount To Pay:
                </Text>

                <View style={{ flexDirection: 'row', }}>
                    <AmountInput setAmount={setSellAmount} width={160} />
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

            <ButtonCTA label="Execute Trade" handlePress={() => { }} />



        </ScrollView>





    )
}

export default TradeAmount