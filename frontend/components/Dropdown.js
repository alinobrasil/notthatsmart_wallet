import { View, Text, Image } from 'react-native'
import React from 'react'
import ModalDropdown from 'react-native-modal-dropdown';
import { SIZES, COLORS } from '../constants/theme'
import triangle from '../assets/sort-down.png'
import { tokens } from '../constants/assets';

const tokenList = Object.keys(tokens).map((key) => {
    return key.toUpperCase()
})

const Dropdown = ({ selectedItem = "USDT", setItem }) => {
    return (
        <View style={{ width: 140 }}>
            <ModalDropdown options={tokenList}
                animated={true}
                defaultValue={selectedItem}
                style={{
                    marginTop: 20,
                    borderColor: "black",
                    // borderWidth: 1,
                    // width: 150,
                    padding: 2
                }}
                textStyle={{
                    fontSize: SIZES.medium,
                    fontColor: COLORS.blue,
                    paddingLeft: 10,
                }}
                dropdownStyle={{
                    width: 150,
                    height: 250,
                    borderColor: "black"
                }}
                renderSeparator={() => { }}
                onSelect={(index, value) => { setItem(value) }}
            />
            <Image source={triangle} style={{
                height: 15,
                width: 15,
                position: "absolute",
                right: 10,
                top: 32,
                zIndex: -1,
            }} />
        </View>
    )
}

export default Dropdown