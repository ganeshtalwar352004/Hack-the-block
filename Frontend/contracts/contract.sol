// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ArbitrationSystem {
    struct Juror {
        address addr;
        uint256 stake;
    }

    struct Voter {
    address pubKey;
    uint256 weight;
    }

    struct Vote {
    address pubKey;
    uint256 voted;
    }
     struct Result {
        address juror;
        uint256 amount;
    }
    struct SelectJuror {
        address pubKey;
        uint256 weight;
    }

    IERC20 public token; // ERC-20 token instance
    Juror[] public jurors;
    uint256 public totalStakedTokens;
    uint256 public constant MAX_JURORS = 100;
    // mapping(address => uint256) public weights;
    mapping(address => uint256) public  voterWeights;
    event TokensStaked(address indexed juror, uint256 amount);
    event JurorsSelected(SelectJuror[] selectedJurors); 
    event DisputeResolved(string result, address[] winners);
    event Winner(uint8 winningOption);
    event RewardsAndPenalties(Result[] rewards, Result[] penalties);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress); // Set the ERC-20 token contract address
    }

    /// @notice Stake tokens to become a juror
    function stakeTokens(uint256 amount) external {
        require(jurors.length < MAX_JURORS, "Max jurors reached");
        require(token.balanceOf(msg.sender) > amount, "Not enough balance");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        bool found = false;
        for (uint256 i = 0; i < jurors.length; i++) {
            if (jurors[i].addr == msg.sender) {
                jurors[i].stake += amount;
                found = true;
                break;
            }
        }

        if (!found){
            jurors.push(Juror({addr: msg.sender, stake: amount}));
        }

        totalStakedTokens += amount;
        emit TokensStaked(msg.sender, amount);
    }

    /// @notice Select jurors randomly based on their stake
    function selectJurors() external returns (SelectJuror[] memory) {
        uint256 jurorCount = jurors.length;
        require(jurorCount > 0, "No jurors available");

        SelectJuror[] memory selectedJurors = new SelectJuror[](jurorCount);

        if (jurorCount <= 10) {
            for (uint256 i = 0; i < jurorCount; i++) {
                uint256 weight = (jurors[i].stake * 100) / totalStakedTokens;
                // weights[jurors[i].addr] = weight;

                selectedJurors[i] = SelectJuror({
                    pubKey: jurors[i].addr,
                    weight: weight
                });
            }

            emit JurorsSelected(selectedJurors); 
            return selectedJurors;
        }

    }

    /// @notice Resolve a dispute and handle rewards and penalties
    function resolveDispute(Voter[] calldata voters, Vote[] calldata votes) external {
        require(voters.length > 0 && votes.length > 0, "Voters and votes cannot be empty");

        uint256 weightedVoteCountOption1 = 0;
        uint256 weightedVoteCountOption2 = 0;

        // Set up the mapping for voter weights
        for (uint256 i = 0; i < voters.length; i++) {
            voterWeights[voters[i].pubKey] = voters[i].weight;
        }

        // Count weighted votes based on provided votes
        for (uint256 i = 0; i < votes.length; i++) {
            uint256 weight = voterWeights[votes[i].pubKey];
            require(weight > 0, "Invalid or unregistered voter");

            if (votes[i].voted == 1) {
                weightedVoteCountOption1 += weight;
            } else if (votes[i].voted == 2) {
                weightedVoteCountOption2 += weight;
            } else {
                revert("Invalid vote option");
            }
        }

        // Determine the winning option based on weighted votes
        uint8 winningOption = weightedVoteCountOption1 > weightedVoteCountOption2 ? 1 : 2;
        emit Winner(winningOption);

        // Create arrays to store rewards and penalties
        Result[] memory rewards = new Result[](votes.length);
        Result[] memory penalties = new Result[](votes.length);
        uint256 rewardIndex = 0;
        uint256 penaltyIndex = 0;
        uint256 majorityStake = 0;
        uint256 totalPenalty = 0;

        // First loop to calculate penalties for minority voters and add them to penalties array
        for (uint256 i = 0; i < votes.length; i++) {
            address voterAddr = votes[i].pubKey;
            Juror memory voter = getJuror(voterAddr);
            uint256 stake = voter.stake;
            require(stake > 0, "Stake must be greater than zero");

            if (votes[i].voted != winningOption) {
                
                uint256 penalty = (stake * 20) / 100; 

                require(token.balanceOf(address(this)) >= penalty, "Insufficient contract balance for penalties");

                totalPenalty += penalty;
                uint256 reducedStake = stake - penalty;
                require(token.transfer(voterAddr, reducedStake), "Penalty transfer failed"); 

               
                penalties[penaltyIndex++] = Result({juror: voterAddr, amount: penalty});
            } else {
               
                majorityStake += stake;
            }
        }

        // Second loop to calculate rewards for majority voters and add them to rewards array
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].voted == winningOption) {
                address majorityVoter = votes[i].pubKey;
                uint256 majStake=getJuror(majorityVoter).stake;
                uint256 reward = (majStake * totalPenalty) / majorityStake;

                require(token.transfer(majorityVoter, reward+majStake), "Reward transfer failed");

                // Store reward result for this juror
                rewards[rewardIndex++] = Result({juror: majorityVoter, amount: reward});
            }
        }

        emit RewardsAndPenalties(rewards, penalties);

}


    /// @notice Get the juror details by address
    function getJuror(address addr) internal view returns (Juror storage) {
        for (uint256 i = 0; i < jurors.length; i++) {
            if (jurors[i].addr == addr) {
                return jurors[i];
            }
        }
        revert("Juror not found");
    }
    
}