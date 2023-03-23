import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../../constants/theme'
import { createStackNavigator } from '@react-navigation/stack';
import { aave, atom, crv, dai, link, matic, usdc, usdt, wbtc, weth } from '../../assets/tokenlogo'
import BuyOrSellScreen from './BuyOrSellScreen';
import TitleText from '../../components/TitleText';
import TradeAmount from './TradeAmount';

const Stack = createStackNavigator();

// navitgation: 
const TradeStack = () => {
    return (
        <Stack.Navigator initialRouteName='TradeRoot' screenOptions={{
            headerMode: 'none'
        }}>
            <Stack.Screen name="TradeRoot" component={TradeRoot} />
            <Stack.Screen name="BuyOrSellScreen" component={BuyOrSellScreen} />
            <Stack.Screen name="TradeAmount" component={TradeAmount} />
        </Stack.Navigator>
    )
}

const TradeRoot = ({ navigation }) => {
    return (
        <SafeAreaView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 20,
            paddingTop: 0,
        }}>

            <TitleText theText="Trade" />

            <Text style={{
                fontSize: SIZES.font,
            }}>
                Buy or sell any of these major tokens.
            </Text>

            <View style={{
                justifyContent: 'space-between',
                display: 'flex',
                marginTop: 20
            }}>
                <FlatList
                    data={dummyData}
                    renderItem={({ item }) => renderItem({ item, navigation })}
                    ListHeaderComponent={listHeader}
                    style={{
                        width: '100%',
                        padding: 40
                    }}
                />
            </View>

        </SafeAreaView>
    )
}

const renderItem = ({ item, navigation }) => {
    return (<>
        <View style={styles.container}>
            <Image source={item.logo}
                style={{ width: 30, height: 30, resizeMode: 'contain' }}
            />
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.textPrice}>${item.price}</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate(
                    'BuyOrSellScreen',
                    { symbol: item.name }
                )
                }
            >
                <Text style={styles.button}>Trade </Text>
            </TouchableOpacity>
        </View>
    </>
    )
}


const listHeader = () => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <Text style={{ fontSize: SIZES.font, width: 110, fontWeight: 'bold' }}>Asset Name</Text>
            <Text style={{ fontSize: SIZES.font, width: 100, fontWeight: 'bold' }}>Price</Text>
            <Text> </Text>
        </View>
    )
}

const dummyData = [
    {
        name: "WBTC",
        price: 25000.23,
        logo: wbtc
    },
    {
        name: "WETH",
        price: 1323.23,
        logo: weth
    },
    {
        name: "MATIC",
        price: 1.23,
        logo: matic
    },
    {
        name: "USDT",
        price: 1.01,
        logo: usdt
    },

]



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        alignItems: 'center',
    },
    text: {
        width: 80,
        textAlign: 'center',
        fontSize: SIZES.font,
    },
    textPrice: {
        width: 90,
        textAlign: 'right',
        fontSize: SIZES.font,
    },
    button: {
        width: 80,
        height: 30,
        backgroundColor: COLORS.red,
        borderRadius: 5,
        // paddingVertical: 10,
        textAlignVertical: 'center',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: SIZES.font,

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default TradeStack