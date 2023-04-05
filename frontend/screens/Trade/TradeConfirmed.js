import { View, Text, Image } from 'react-native'
import React from 'react'
import GreenCheck from '../../assets/yes.png';
import { SIZES, COLORS } from '../../constants/theme'
import TitleText from '../../components/TitleText';
import ButtonCTA from '../../components/ButtonCTA';

const TradeConfirmed = ({ route, navigation }) => {

    const paidAmount = route.params.paidAmount
    const paidToken = route.params.paidToken
    const receivedAmount = route.params.receivedAmount
    const receivedToken = route.params.receivedToken

    const confirmationMessage = `You paid ${paidAmount} ${paidToken} and received ${receivedAmount} ${receivedToken}`

    return (
        <View style={{
            justifyContent: 'center',
            alignContent: 'center',
            padding: 30,
        }}>
            <TitleText theText='Trade Successful' />
            <Image source={GreenCheck} style={{
                width: 200,
                height: 200,
                alignSelf: 'center',
                marginTop: 60
            }} />
            <TitleText theText={confirmationMessage} />
            <ButtonCTA label="Go to Home" handlePress={() => navigation.navigate("Home")} />

        </View>
    )
}

export default TradeConfirmed