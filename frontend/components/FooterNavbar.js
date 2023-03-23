import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { HomeIcon } from '../assets'

const FooterNavbar = () => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'lightgrey',
        }}>
            <TouchableOpacity style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>Home</Text>
                {/* <Image source={HomeIcon} /> */}
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>Element 2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>Element 3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>Element 4</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
                <Text style={{ fontSize: 20 }}>Element 5</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FooterNavbar