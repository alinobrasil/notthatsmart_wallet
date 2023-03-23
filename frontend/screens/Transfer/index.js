import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const TransferStack = ({ navigation }) => {
    return (

        <Stack.Navigator initialRouteName='Transfer' screenOptions={{
            headerMode: 'none'
        }}>
            <Stack.Screen name="TransferRoot" component={TransferScreen} />
            <Stack.Screen name="TransferSend" component={TransferSend} />
        </Stack.Navigator>

    )
}

const TransferSend = () => {
    return (
        <View>
            <Text>
                Send some money yo
            </Text>


        </View >
    )
}


const TransferScreen = ({ route, navigation }) => {
    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text
                // onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>
                What would you like to do?
            </Text>
            <TouchableOpacity
                style={{
                    // width: 40,
                    // height: 40,
                    backgroundColor: 'red',
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 10,
                    padding: 20,
                }}
                onPress={() => { navigation.navigate("TransferSend") }}
            >
                <Text>Send</Text>
            </TouchableOpacity>


        </View>
    )
}

export default TransferStack