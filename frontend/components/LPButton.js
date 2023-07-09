import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SIZES, COLORS } from '../constants/theme'
import { tokens } from '../constants/assets'

const LPButton = ({ assetname, handlePress, height = 90, interestRate = "99.99" }) => {
    return (
        <TouchableOpacity style=
            {{
                borderRadius: 10,
                justifyContent: 'space-between',
                width: "95%",
                height: height,
                borderColor: COLORS.rose,
                borderWidth: 1,
                backgroundColor: COLORS.lightrose,
                margin: 10,
                marginBottom: 5,
                flexDirection: "row",
                padding: 10
            }}
            onPress={handlePress}
        >
            <View style={{
                flexDirection: "row",
                flex: 1
            }}>


                {/* logo */}
                <View style={{
                    flex: 0.2,
                    paddingTop: 4,
                    // alignItems: "center",
                    // justifyContent: "center"
                }}>
                    <Image
                        source={tokens[assetname].image}
                        style={{
                            width: 48,
                            height: 48,
                            marginRight: 10,
                            // flex: 0.2,
                        }} />
                </View>



                {/* main text */}
                <View style={{
                    flex: 0.6,
                    paddingLeft: 3,
                }}>
                    <Text style={{
                        fontSize: SIZES.medium,
                        fontWeight: 'bold',
                        color: COLORS.blue,
                        textAlign: 'left',
                        textTransform: "uppercase"
                    }}>
                        {assetname}
                    </Text>

                    <Text style={{
                        color: 'grey',
                        fontSize: SIZES.base,
                    }}>
                        {tokens[assetname].description}
                    </Text>
                </View>
            </View>


            <View style={{
                flex: 0.2
            }}>
                <Text style={{
                    fontSize: 10,
                    color: COLORS.red,
                    fontWeight: "bold",
                    textTransform: "uppercase"
                }}>
                    Interest rate
                </Text>
                <Text style={{ fontSize: SIZES.font }}>{interestRate}%</Text>
            </View>




        </TouchableOpacity>
    )
}

export default LPButton