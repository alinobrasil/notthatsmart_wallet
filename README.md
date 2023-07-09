## Smart Contract Wallet for onboarding new DeFi users
- Enjoy the best of DeFi with extremely reduced risk
- Intuitive for complete beginners

Demo video: https://youtu.be/WKr5pZbicG4


## Problems solved:
- Convenience: Simple actions like depositing to Aave to earn interest only need to be signed off once. EOA accounts require separate transactions for approve erc20 token and deposit into protocol.
- Safety: 
    - Can't connect to phishing sites or defi protocols that haven't been integrated yet
    - Never approve ERC20 token amounts more than you need to

## Under the hood:
- Smart contract wallet that can only interact with a few defi protocols (thus codename notsosmart wallet). Integrated with Aave, Uniswap & Quickswap on Polygon mainnet
- Frontend using React Native
- This is a work in progress. For now it's working in a test environment: local hardhat node forking polygon mainnet, using test privatekey as EOA. 

## How to run in test env:
In the hardhat folder:

1. Run hardhat node, to run a test chain that mirrors polygon mainnet. 
```
export POLYGON_RPC_URL=(YOUR RPC URL)
npx hardhat node --hostname 0.0.0.0 --fork $POLYGON_RPC_URL
```

1.5. in hardhat config, set the ip address of the network polygonfork to your own computer's network. 
 
```
polygonfork: {
            url: 'http://192.168.2.200:8545',
            accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
                '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d']
        }
```

2. run hardhat test to deploy wallet
```
npx hardhat test test/loadingWMATIC.js --network polygonfork
```

3. Go to the frontend folder and open App.js. Right after the import statements you'll see some variables initialized. 

a. Set the deployed contract wallet address you see on screen from the previous step. 
```const deployedWalletAddress = "0x329058C12E8B269BFA0896c8705b427c5Dd26b96"```

b. Set your computer's IP address where the provider is initialized. Should start with 192.168.
```const provider = new ethers.providers.JsonRpcProvider("http://192.168.2.200:8545");```


4.  Run the react native app with expo and you should see a QR code on screen
```
npm start
```

5. Use the expo mobile app to scan the qr code on screen.


## Outstanding tasks / improvements:
UX/UI: 
- Hourglass animations while waiting for transactions to be confirmed
- Enable input BuyToken to initiate swap based on Output amount
- simplify adding liquidity. use 1 token, execute trade, deposit into LP


Backend:
- Handle deployment + setting owner
- EOA private key generation or replace with AA
- Gas:
    - Separate gas account. auto-reminders to refill or auto-execution of maintaining gas money in EOA
    - account abstraction: pay gas using existing token balance
- Restore wallet
- Social recovery
- fiat onramp

- interest rates: Show historical average
- borrow money
- portfolio
- more descriptive status of investments: eg. how much was deposited, how much interest was earned. 

