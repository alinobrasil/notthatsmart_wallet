import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { abi as ERC20_ABI } from '../constants/artifacts/ERC20.json'
import { tokens, aPolTokens } from '../constants/assets'
import AppContext from '../context'
import { ethers } from "ethers";
import { SIZES } from '../constants/theme'


const Portfolio = () => {
    const tokenList = Object.entries(tokens).map(([key, value]) => ({ ...value, name: key }));
    const context = useContext(AppContext);
    const { provider, signer, wallet } = context;

    const [erc20Balances, setErc20Balances] = useState([])
    const [aTokenBalances, setATokenBalances] = useState([])
    const [nonZeroBalances, setNonZeroBalances] = useState([])


    /**
     * sample code to get al ltoken balances... for ERC20 tokens
     * Loops through a token list to retrieve balances for a given wallet
     * @param {*} tokenList array of tokens with address, symbol, decimals and name
     * @param {*} wallet address to query balance from
     * @param {*} block block number to query past balances
     * @returns Array of balances
     */



    const getAllTokenBalances = async (tokenList, wallet, block) => {
        // array to store all balance requests
        let proms = []
        // array to store balances
        let results = []

        console.log("tokenList: ", tokenList)
        for (const tkn of tokenList) {
            // create ERC20 token contract instance
            const erc20 = new ethers.Contract(tkn.address, ERC20_ABI, provider)
            // save request in array of Promises
            proms.push(
                erc20.balanceOf(
                    wallet,
                    // { blockTag: +block, }
                )
            )
        }
        // actually requests all balances simultaneously
        const promiseResults = await Promise.allSettled(proms)
        // loop through all responses to format response
        for (let index = 0; index < promiseResults.length; index++) {
            // transforms balance to decimal
            const bal = convertToNumber(
                promiseResults[index].value,
                tokenList[index].decimals
            )
            // save balance with token name and symbol
            results.push({
                name: tokenList[index].name,
                // symbol: tokenList[index].symbol,
                balance: Number(bal).toFixed(2),
            })
        }
        return results
    }

    const convertToNumber = (hex, decimals = 18) => {
        if (!hex) return 0
        console.log(`Converting to number ${hex} with ${decimals} decimals`)
        return ethers.utils.formatUnits(hex, decimals)
    }

    useEffect(() => {
        const getBalances = async () => {
            const balances = await getAllTokenBalances(tokenList, wallet.address, 0)
            setErc20Balances(balances)

            const aPolTokenBalances = await getAllTokenBalances(aPolTokens, wallet.address, 0)
            setATokenBalances(aPolTokenBalances)

            console.log(aPolTokenBalances)

        }
        getBalances()

    }, [])

    useEffect(() => {
        console.log("ERC20 balances:")
        const nonZero = erc20Balances.filter((token) => Number(token.balance) !== 0);
        setNonZeroBalances(nonZero)
        nonZero.forEach((token) => {
            console.log(JSON.stringify(token));
        })

    }, [erc20Balances])




    return (

        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: SIZES.large, margin: 10 }}>Portfolio</Text>

            <Text style={{ fontSize: SIZES.medium, margin: 10 }}>ERC20 tokens</Text>
            <View style={{ margin: 10 }}>
                {nonZeroBalances.map((token) => (
                    <View key={token.name}>
                        <Text>{token.name.toUpperCase()}: {token.balance}   </Text>
                    </View>
                ))}
            </View>

            <Text style={{ fontSize: SIZES.medium, margin: 10 }}>Savings on Aave</Text>
            <View style={{ margin: 10 }}>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        marginBottom: 20,
    },
});



export default Portfolio