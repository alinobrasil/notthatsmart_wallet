import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useEffect } from 'react'
import { SIZES, COLORS } from '../../constants/theme'
import { createStackNavigator } from '@react-navigation/stack';
import { aave, atom, crv, dai, link, matic, usdc, usdt, wbtc, weth } from '../../assets/tokenlogo'
import BuyOrSellScreen from './BuyOrSellScreen';
import TitleText from '../../components/TitleText';
import TradeAmount from './TradeAmount';
import TradeConfirmed from './TradeConfirmed';
import { tokens } from '../../constants/assets';
import { COINMARKETCAP_KEY } from '../../key';
import axios from 'axios';

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
            <Stack.Screen name="TradeConfirmed" component={TradeConfirmed} />
        </Stack.Navigator>
    )
}

const TradeRoot = ({ navigation }) => {

    let tradableTokens = []

    const getPrices = async () => {
        //getting quick prices from coinmarketcap
        let symbols = Object.keys(tokens);
        let symbollist = symbols.join(',');
        console.log("symbollist:", symbollist)

        let response;
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest', {
                headers: {
                    'X-CMC_PRO_API_KEY': COINMARKETCAP_KEY,
                },
                params: {
                    symbol: symbollist,
                }
            });
        } catch (ex) {
            console.log(ex);
        }
        if (response) {
            // success
            const results = response.data.data;
            for (let symbol in results) {
                // console.log(symbol, results[symbol][0].quote.USD.price)
                let price = results[symbol][0].quote.USD.price
                let tokenObj = {
                    name: symbol,
                    price: price.toFixed(2),
                    logo: tokens[symbol.toLowerCase()].image
                }
                tradableTokens.push(tokenObj)
            }

            console.log("Tradeable tokens:")
            console.log(tradableTokens)
        }
    }

    useEffect(() => {
        //fetch prices when component mounts
        getPrices();
    }, [navigation])

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
                    data={tradableTokens}
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
                )}
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


// const dummyData = [
//     {
//         name: "WBTC",
//         price: 25000.23,
//         logo: wbtc
//     },
//     {
//         name: "WETH",
//         price: 1323.23,
//         logo: weth
//     },
//     {
//         name: "WMATIC",
//         price: 1.23,
//         logo: matic
//     },
//     {
//         name: "USDT",
//         price: 1.01,
//         logo: usdt
//     },

// ]


export default TradeStack