import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../constants/theme'

const BigButton = ({ title, description, handlePress, height = 140 }) => {
    return (
        <TouchableOpacity style=
            {{
                borderRadius: 10,
                padding: 20,
                paddingBottom: 30,
                justifyContent: 'space-between',
                width: 330,
                height: height,
                borderColor: COLORS.rose,
                borderWidth: 1,
                backgroundColor: COLORS.lightrose,
                margin: 10,
                marginBottom: 20

            }}
            onPress={handlePress}
        >
            <Text style={{
                fontSize: SIZES.medium,
                fontWeight: 'bold',
                color: COLORS.blue
                // textAlign: 'center'
            }}>
                {title}
            </Text>

            <Text style={{
                color: 'grey'
            }}>
                {description}
            </Text>
        </TouchableOpacity>
    )
}

export default BigButton