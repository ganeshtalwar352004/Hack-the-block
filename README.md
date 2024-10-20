# #  Hack-the-block

# Arbitration System Smart Contract 🏛️
This repository contains a Solidity-based Arbitration System that uses ERC-20 tokens for staking, voting, penalties, and rewards. The system selects jurors randomly based on their staked tokens, applies penalties to minority voters, and distributes rewards to majority voters through ERC-20 token transfers.

 # Features 🚀
Stake Tokens: Jurors can stake ERC-20 tokens to participate in arbitration.
Token-Weighted Juror Selection: Higher token stakes increase the chance of being selected.
Dispute Resolution: Jurors vote on disputes, with rewards and penalties based on the voting outcome.
Penalties and Rewards Reflected in Wallets: Tokens are transferred directly between the jurors’ wallets and the contract.

# How It Works 🔍
Staking: Jurors stake ERC-20 tokens, transferring them to the contract to participate in dispute resolution.
Juror Selection: A random pool of jurors is selected for each dispute, with selection chances proportional to the stake.
Voting and Resolution: Jurors vote on the dispute, and based on the majority vote:
Majority Voters: Receive rewards from the penalty pool.
Minority Voters: Lose 20% of their staked tokens, transferred to the contract.
Penalties and Rewards: All penalties and rewards are reflected directly in wallets through ERC-20 token transfers.


# Smart Contract Functions 🔧
1. stakeTokens(uint256 amount)
Description: Allows jurors to stake ERC-20 tokens.
Effect: Transfers tokens from the juror’s wallet to the contract.
2. selectJurors(uint256 poolSize)
Description: Randomly selects a pool of jurors based on token stakes.
Effect: Higher stakes increase the chances of selection.
3. resolveDispute(address[] calldata voters, uint8[] calldata votes)
Description: Resolves the dispute and handles rewards and penalties.
Effect: Rewards majority voters and penalizes minority voters with ERC-20 token transfers.
4. getJurorByToken(uint256 token)
Description: Identifies the juror corresponding to a given token.
5. getJuror(address addr)
Description: Retrieves the stake and address of a specific juror.


#  Security Considerations 🔒
Reentrancy Protection: Ensure transfer and transferFrom calls are reentrancy-safe.
Input Validation: Validate inputs (e.g., ensure positive amounts for staking).
Gas Optimization: Optimize loops to reduce gas consumption for large juror pools.


# Summary 🛠️
This Arbitration System ensures fair dispute resolution using ERC-20 tokens. The system offers transparent penalties and rewards by reflecting all changes in wallet balances, incentivizing fair voting among jurors.

