import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from 'react-native'
import { VANITY_ETH } from "./key";

import AppContext from "./context";
import WalletArtifact from './constants/WalletContractArtifact.json'
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values"
// Pull in the shims (BEFORE importing ethers)
import "@ethersproject/shims"
// Import the ethers library
import { ethers } from "ethers";

//page (screen) components
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransferStack from './screens/Transfer'
import HomeScreen from "./screens/Home";
import SettingsScreen from "./screens/Settings";
import InvestStack from "./screens/Invest";
import TradeStack from "./screens/Trade";

import { Ionicons, MaterialIcons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { COLORS, SIZES } from './constants/theme'

//env variables
import Config from 'react-native-config';
// import { PRIVATE_KEY, POLYGON_MAINNET_URL } from '@env';
// const PRIVATE_KEY = Config.PRIVATE_KEY;

const PRIVATE_KEY = VANITY_ETH

const POLYGON_MAINNET_URL = Config.POLYGON_MAINNET_URL;
console.log("\n\n##ENV VARIABLES")
console.log("Config:")
console.log(Config)

const Tab = createBottomTabNavigator();

function App() {

    const provider = new ethers.providers.JsonRpcProvider("http://192.168.2.15:8545");
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    return (
        <AppContext.Provider value={{
            provider,
            signer,
        }}>
            <NavigationContainer>
                <Tab.Navigator initialRouteName="Home"
                    screenOptions={{
                        tabBarActiveTintColor: COLORS.blue,
                        tabBarInactiveTintColor: 'gray'
                    }}
                >

                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) =>
                                (<Ionicons name='home' color={color} size={size} />)
                        }}
                    />

                    <Tab.Screen name="Trade" component={TradeStack}
                        options={{
                            tabBarIcon: ({ focused, color, size }) =>
                                (<MaterialIcons name='compare-arrows' color={color} size={size} />)
                        }}
                    />

                    <Tab.Screen name="Invest" component={InvestStack}
                        options={{
                            tabBarIcon: ({ focused, color, size }) =>
                                (<MaterialCommunityIcons name='finance' color={color} size={size} />)
                        }}
                    />

                    <Tab.Screen name="Transfer" component={TransferStack}
                        options={{
                            tabBarIcon: ({ focused, color, size }) =>
                                (<MaterialIcons name='send' color={color} size={size} />)
                        }}
                    />

                    <Tab.Screen name="Settings" component={SettingsScreen}
                        options={{
                            tabBarIcon: ({ focused, color, size }) =>
                                (<MaterialIcons name='settings' color={color} size={size} />)
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </AppContext.Provider>
    );
}

export default App;