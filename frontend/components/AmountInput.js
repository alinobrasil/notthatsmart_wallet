import { View, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, COLORS } from '../constants/theme'

const AmountInput = ({ inputAmount, setAmount, width = 200 }) => {

    // const [inputValue, setInputValue] = useState(inputAmount);

    // useEffect(() => {
    //     setInputValue(inputAmount)
    // }, [inputAmount])


    return (
        <View>
            <TextInput
                defaultValue='0'
                value={inputAmount.toString()}
                fontSize={SIZES.medium}
                onChangeText={t => setAmount(Number(t))}
                style={{
                    margin: 10,
                    padding: 10,
                    borderColor: "#000000",
                    borderBottomWidth: 1,
                    width: width,
                    textAlign: 'right',
                    color: COLORS.red,
                }}
            />
        </View>
    )
}

export default AmountInput