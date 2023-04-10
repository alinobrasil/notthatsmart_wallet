import { View, Text, SafeAreaView, ScrollView, TextInput } from 'react-native'
import { SIZES, COLORS } from '../../constants/theme'
import { useContext, useState, useEffect } from 'react'
import PercentBox from '../../components/PercentBox'
import AppContext from '../../context'
import { CleanNumber } from '../../utils/calculations'
import AmountInput from '../../components/AmountInput'
import { ethers } from "ethers";
import { tokens } from '../../constants/assets'
import ERC20Artifact from '../../constants/artifacts/ERC20.json'
import ButtonCTA from '../../components/ButtonCTA'

const SavingsDeposit = ({ route, navigation }) => {
    const context = useContext(AppContext);
    const { provider, signer, wallet } = context;

    const symbol = route.params.symbol;
    const rate = route.params.rate;
    const tokenContract = new ethers.Contract(
        tokens[symbol.toLowerCase()].address,
        ERC20Artifact.abi,
        provider
    )

    const [chosenPct, setChosenPct] = useState(0)
    const [inputAmount, setInputAmount] = useState(0)
    const [tokenBalance, setTokenBalance] = useState("0")

    const getAccount0Balance = async () => {
        try {
            //showing accounts0 native wmatic balance
            const x = await provider.getBalance(signer.address);
            console.log("\n\n")
            console.log("account0 native wmatic: ", CleanNumber(x))
        }
        catch (e) {
            console.log(e)
        }
    }

    const handlePress = async (pctValue) => {
        console.log(`${pctValue}% x ${tokenBalance} = ${tokenBalance * pctValue / 100}`)
        setChosenPct(pctValue)
        setInputAmount(tokenBalance * pctValue / 100)

    }

    // useEffect(() => {
    //     console.log("inputAmount: ", inputAmount)
    // }, [inputAmount])

    const getTokenBalance = async () => {
        let balance = await tokenContract.balanceOf(wallet.address);
        balance = ethers.utils.formatEther(balance.toString())
        balance = Number(balance).toFixed(4)
        console.log(`Wallet's balance of ${symbol}: ${balance}`)
        setTokenBalance(balance)
    }

    const executeDeposit = async () => {
        console.log("Executing deposit...")
        let tx = await wallet.aave_deposit(
            tokenContract.address,
            ethers.utils.parseUnits(inputAmount.toString(), await tokenContract.decimals()),
        )

        console.log("Done------------------")
        console.log(`Deposit tx: ${tx.hash}`)
        console.log(tx)
        console.log("Token contract address: ", tokenContract.address)
        console.log("Amount to deposit: ", ethers.utils.parseUnits(inputAmount.toString(), await tokenContract.decimals()))

        navigation.navigate('SavingsConfirmed',
            {
                rate: rate,
                symbol: symbol,
            })

    }

    useEffect(() => {
        getAccount0Balance()
        getTokenBalance();
    }, [])

    return (
        <ScrollView>
            <SafeAreaView style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 5,
            }}>
                <Text style={{
                    fontSize: SIZES.large,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: COLORS.blue,
                    // marginTop: 10,
                    marginBottom: 30,
                }}>
                    Deposit
                </Text>



                <Text style={{
                    fontSize: SIZES.medium,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: COLORS.blue,

                }}>
                    How much would you like to deposit?
                </Text>


                <Text style={{
                    fontSize: SIZES.small,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: COLORS.blue,
                    marginTop: 40,

                }}>
                    Choose an amount or type directly into the textbox:
                </Text>

                {/* Value input */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <AmountInput setAmount={setInputAmount} inputAmount={inputAmount} />

                    <Text style={{ fontSize: SIZES.medium }} >
                        {symbol}
                    </Text>

                </View>

                <Text> You have {tokenBalance} {symbol} available in your wallet. </Text>



                {/* Percentage boxes */}
                <View style={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '80%'
                }}>
                    <PercentBox percentValue="25" handlePress={() => handlePress(25)} />
                    <PercentBox percentValue="50" handlePress={() => handlePress(50)} />
                    <PercentBox percentValue="75" handlePress={() => handlePress(75)} />
                    <PercentBox percentValue="100" handlePress={() => handlePress(100)} />
                </View>

                <View style={{ marginTop: 50 }}>

                    <ButtonCTA label='Deposit' handlePress={executeDeposit} />

                    <Text>You'll be earning {rate}% per year.</Text>
                </View>



            </SafeAreaView>

        </ScrollView>
    )
}

export default SavingsDeposit