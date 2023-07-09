import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import AssetButton from '../../components/AssetButton'
import { SIZES, COLORS } from '../../constants/theme'
import { getRates, getReserves, testProvider } from '../../utils/aaveRates'

const SavingsScreen = ({ navigation }) => {
    const [rates, setRates] = useState({});

    function showRates() {
        getRates()
            .then((data) => {
                setRates(data)
                // console.log(JSON.stringify(rates, null, 2))
            })
            .catch(error => {
                console.log("\n\n")
                console.log(error)
            })
    }

    useEffect(() => {
        showRates()
    }, []);


    // log rates when they are updated in state variable
    useEffect(() => {
        console.log("rates updated!")
        console.log(rates)
    }, [rates])

    return (
        <ScrollView>
            <SafeAreaView style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 15,
            }}>
                <Text style={{
                    fontSize: SIZES.large,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: COLORS.blue,
                    // marginTop: 10,
                    marginBottom: 30,
                }}>
                    Savings
                </Text>

                <Text style={{
                    fontSize: SIZES.font,
                    marginBottom: 30,
                }}>
                    Your assets get deposited into Aave, the largest lending protocol.
                    You earn interest because your assets get lent out to borrowers.
                </Text>

                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: COLORS.blue,
                    marginTop: 10,
                    marginBottom: 20,
                }}>
                    What would you like to deposit?
                </Text>


                <View style={{
                    justifyContent: 'space-between',
                    display: 'flex'
                }}>

                    {/* <AssetButton
                        assetname="weth"
                        interestRate={rates.WETH}
                        handlePress={() => navigation.navigate(
                            'SavingsDeposit',
                            {
                                symbol: "WETH",
                                rate: rates.WETH,
                            }
                        )} /> */}

                    {/* <AssetButton assetname="usdc" interestRate={rates.USDC} />
                    <AssetButton assetname="usdt" interestRate={rates.USDT} />
                    <AssetButton assetname="dai" interestRate={rates.DAI} />
                    <AssetButton assetname="wbtc" interestRate={rates.WBTC} /> */}

                    {Object.entries(rates).map(([key, value]) => {
                        console.log(key, value)
                        return <AssetButton
                            assetname={key.toLowerCase()}
                            interestRate={value}
                            handlePress={() => navigation.navigate(
                                'SavingsDeposit',
                                {
                                    symbol: key,
                                    rate: value,
                                }
                            )}

                        />
                    }
                    )}


                </View>

            </SafeAreaView>

        </ScrollView>
    )
}

export default SavingsScreen