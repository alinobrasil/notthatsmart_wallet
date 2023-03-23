import React, { useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import FooterNavbar from "./components/FooterNavbar";
import AppContext from "./context";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

const Stack = createStackNavigator();

function App() {
    const [state, setState] = useState({
        count: 0,
        userName: ""
    });

    return (
        <AppContext.Provider value={{ state, setState }}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home">
                    <Stack.Screen
                        name="Welcome"
                        component={Welcome}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            headerShown: false
                        }}
                    />
                </Stack.Navigator>

                <FooterNavbar />
            </NavigationContainer>
        </AppContext.Provider>
    );
}

export default App;