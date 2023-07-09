import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import GreenCheck from '../../assets/yes.png';
import { SIZES, COLORS } from '../../constants/theme'
import TitleText from '../../components/TitleText';
import ButtonCTA from '../../components/ButtonCTA';

const SavingsConfirmed = ({ route, navigation }) => {

    const symbol = route.params.symbol;
    const rate = route.params.rate;
    const confirmationMessage = `You are now earning ${Number(rate).toFixed(2)}% on your ${symbol}`

    return (
        <View style={{
            justifyContent: 'center',
            alignContent: 'center',
            padding: 30,
        }}>
            <TitleText theText='Deposit Successful' />
            <Image source={GreenCheck} style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
                marginTop: 60
            }} />
            <TitleText theText={confirmationMessage} />
            <ButtonCTA label="Go to Home" handlePress={() =>
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            } />

        </View>
    )
}

export default SavingsConfirmed