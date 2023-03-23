import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../constants/theme'

const ButtonCTA = ({ label = "Button Label Text", handlePress }) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: COLORS.red,
            padding: 30,
            borderRadius: 10,
            margin: 30,
        }}
            onPress={handlePress}
        >
            <Text style={{
                fontSize: SIZES.medium,
                color: 'white',
                textAlign: 'center',
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default ButtonCTA