import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../constants/theme'

const PercentBox = ({ percentValue, handlePress }) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: COLORS.blue,
            borderRadius: 10,
            padding: 10,
            margin: 10,
        }}
            onPress={handlePress}
        >
            <Text style={{
                color: "white",
                fontSize: SIZES.font
            }}
            >{percentValue}%</Text>
        </TouchableOpacity>
    )
}

export default PercentBox