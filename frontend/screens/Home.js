import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import BigButton from '../components/BigButton'
import { SIZES, COLORS } from '../constants/theme'

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: 20
        }}>
            <Text style={{
                fontSize: SIZES.large,
                fontWeight: 'bold',
                textAlign: 'center',
                color: COLORS.blue,
            }}>
                What would you like to start with?
            </Text>

            <View style={{
                justifyContent: 'space-between',
                // columnGap: 20,
                display: 'flex'
            }}>
                <BigButton
                    title="Trade"
                    description="Buy & sell top crypto tokens"
                    handlePress={() => navigation.navigate('Trade')}
                />

                <BigButton
                    title="Invest"
                    description="Generate passive income on your crypto assets"
                    handlePress={() => navigation.navigate('Invest')}
                />

                <BigButton title="Transfer" description="Send / Receive crypto"
                    handlePress={() => navigation.navigate('Transfer')}
                />
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen