import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

//screens
import InvestRoot from './InvestRoot';
import SavingsScreen from './Savings'
import EarnTradingFeesScreen from './EarnTradingFees'
import SavingsDeposit from './SavingsDeposit';

const Stack = createStackNavigator();


const InvestStack = () => {
    return (
        <Stack.Navigator initialRouteName='Invest' screenOptions={{
            headerMode: 'none'
        }}>
            <Stack.Screen name="InvestRoot" component={InvestRoot} />

            <Stack.Screen name="SavingsScreen" component={SavingsScreen} />
            <Stack.Screen name="SavingsDeposit" component={SavingsDeposit} />


            <Stack.Screen name="EarnTradingFeesScreen" component={EarnTradingFeesScreen} />

        </Stack.Navigator>
    )
}

export default InvestStack