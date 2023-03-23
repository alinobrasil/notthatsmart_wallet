import { View, Text, Image } from 'react-native'
import React from 'react'
import TitleText from '../../components/TitleText'
import { tokens } from '../../constants/assets'
import { SIZES } from '../../constants/theme'
import ButtonCTA from '../../components/ButtonCTA'

const BuyOrSellScreen = ({ route, navigation }) => {
    const symbol = route.params.symbol
    const token = tokens[symbol.toLowerCase()]

    return (
        <View style={{
            padding: 40
        }}>
            <TitleText theText="Trade" />

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginBottom: 50
            }}>
                <Image source={token.image} style={{
                    width: 70,
                    height: 70,
                }} />

                <Text style={{
                    marginRight: 50,
                    fontSize: SIZES.large,
                    textAlignVertical: 'center',
                }}>
                    {symbol}</Text>

            </View>

            <View>
                <Text style={{
                    fontSize: SIZES.medium,
                }}>
                    {token.description}
                </Text>

                <Text style={{
                    marginTop: 100,
                    fontSize: SIZES.medium,
                }}>
                    What would you like to do?
                </Text>

            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly'
            }}>
                <ButtonCTA label="Buy"
                    handlePress={() => navigation.navigate(
                        "TradeAmount",
                        {
                            symbol: symbol,
                            action: "buy"
                        })} />
                <ButtonCTA label="Sell"
                    handlePress={() => navigation.navigate(
                        "TradeAmount",
                        {
                            symbol: symbol,
                            action: "sell"
                        })} />
            </View>


        </View>
    )
}

export default BuyOrSellScreen