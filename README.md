## Smart Contract Wallet for onboarding new DeFi users
- Enjoy the best of DeFi with extremely reduced risk
- Intuitive by design

## Problems solved:
- Convenience: Simple actions like depositing to Aave to earn interest only need to be signed off once. EOA accounts require separate transactions for approve erc20 token and deposit into protocol.
- Safety: 
    - Can't connect to phishing sites or defi protocols that haven't been integrated yet
    - Never approve ERC20 token amounts more than you need to

## Under the hood:
- Smart contract wallet that can only interact with a few defi protocols (thus codename notsosmart wallet)
- Integrated with Aave, Uniswap & Quickswap on Polygon mainnet




## Outstanding tasks / improvements:
- Frontend: Organize by actions & end results, not by protocol name (how most aggregators and defi wallets do it)
- Handle deployment + setting owner
- restore
- fiat onramp
- auto-reminders or auto-execution of maintaining gas money in EOA
- simplify adding liquidity. use 1 token, execute trade, deposit into LP
- interest rates: Show historical average
- borrow money
- more descriptive status of investments: eg. how much was deposited, how much interest was earned. 

