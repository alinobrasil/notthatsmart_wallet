import { View, Text, SafeAreaView, ScrollView, TextInput } from 'react-native'
import { SIZES, COLORS } from '../../constants/theme'
import { useContext, useState, useEffect } from 'react'
import PercentBox from '../../components/PercentBox'
import AppContext from '../../context'
import { CleanNumber } from '../../utils/calculations'
import AmountInput from '../../components/AmountInput'

const SavingsDeposit = ({ route, navigation }) => {
    const [chosenPct, setChosenPct] = useState(0)
    const [amount, setAmount] = useState("0")

    const context = useContext(AppContext);
    const { provider, signer } = context;

    const getBalance = async () => {
        try {
            const x = await provider.getBalance(signer.address);
            console.log("\n\n")
            console.log(x)
            console.log("string:", x.toString())
            console.log("clean: ", CleanNumber(x))
            setAmount(CleanNumber(x))
        }
        catch (e) {
            console.log(e)
        }
    }


    const handlePress = (pctValue) => {
        setChosenPct(pctValue)
        getBalance()
    }

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

                    {/* <TextInput defaultValue='0'
                        fontSize={SIZES.medium}
                        onChangeText={t => setAmount(t)}
                        style={{
                            margin: 10,
                            padding: 10,
                            borderColor: "#000000",
                            borderBottomWidth: 1,
                            width: 200,
                            textAlign: 'right',
                            color: COLORS.red,

                        }}
                    /> */}
                    <AmountInput setAmount={setAmount} />


                    <Text style={{ fontSize: SIZES.medium }} >
                        {route.params.symbol}
                    </Text>

                </View>


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

                <Text> Wallet Amount (Native): {amount} </Text>
                <Text> Chosen %: {chosenPct} </Text>
                <Text> Asset Amount: </Text>

            </SafeAreaView>

        </ScrollView>
    )
}

export default SavingsDeposit