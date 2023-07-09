import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import TitleText from '../../components/TitleText'
import { COLORS, SIZES } from '../../constants/theme'

const EarnTradingFeesScreen = () => {
    return (
        <ScrollView style={{
            padding: 30,
            paddingTop: 0
        }}>
            <TitleText theText="Earn" />

            <Text>
                Deposit two of your assets to enable others to trade them.
                Earn a portion of fees on every transaction.
            </Text>

            <Text style={{
                fontSize: SIZES.medium,
                color: COLORS.blue,
                fontWeight: 'bold',
                paddingTop: 20,
            }}>
                Top Trading Pairs
            </Text>

        </ScrollView>
    )
}

export default EarnTradingFeesScreen