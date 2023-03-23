import { View, Text } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../constants/theme'

const TitleText = ({ theText = "Title here" }) => {
    return (
        <Text style={{
            fontSize: SIZES.large,
            fontWeight: 'bold',
            textAlign: 'center',
            color: COLORS.blue,
            marginVertical: 30,
        }}>
            {theText}
        </Text>
    )
}

export default TitleText