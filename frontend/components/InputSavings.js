import { View, TextInput } from 'react-native'
import { SIZES, COLORS } from '../constants/theme'

const InputSavings = ({ inputAmount, setAmount, width = 200 }) => {


    return (
        <View>
            <TextInput
                // defaultValue='0'
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

export default InputSavings