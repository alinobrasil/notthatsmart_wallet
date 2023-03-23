import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BigButton from '../../components/BigButton'
import { SIZES, COLORS } from '../../constants/theme'

const InvestRoot = ({ navigation }) => {
    return (
        <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 20,
        }}>
            <Text style={{
                fontSize: SIZES.large,
                fontWeight: 'bold',
                textAlign: 'center',
                color: COLORS.blue,
                marginTop: 50,
                marginBottom: 50,
            }}>
                Invest
            </Text>

            <View style={{
                justifyContent: 'space-between',
                // columnGap: 20,
                display: 'flex'
            }}>
                <BigButton
                    title="Savings"
                    description="Deposit your tokens and earn interest just like a savings account"
                    handlePress={() => navigation.navigate('SavingsScreen')}
                />

                <BigButton
                    title="Earn Trading Fees"
                    description="Facilitate decentralized finance (DeFi) trades to earn passive income"
                    handlePress={() => navigation.navigate('EarnTradingFeesScreen')}
                />



            </View>

        </SafeAreaView>
    )
}

export default InvestRoot