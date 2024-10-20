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

    IERC20 public token; // ERC-20 token instance
    Juror[] public jurors;
    uint256 public totalStakedTokens;
    uint256 public constant MAX_JURORS = 100;

    event TokensStaked(address indexed juror, uint256 amount);
    event JurorsSelected(address[] selectedJurors);
    event DisputeResolved(string result, address[] winners);

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress); // Set the ERC-20 token contract address
    }

    /// @notice Stake tokens to become a juror
    function stakeTokens(uint256 amount) external {
        require(jurors.length < MAX_JURORS, "Max jurors reached");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        bool found = false;
        for (uint256 i = 0; i < jurors.length; i++) {
            if (jurors[i].addr == msg.sender) {
                jurors[i].stake += amount;
                found = true;
                break;
            }
        }

        if (!found) {
            jurors.push(Juror({addr: msg.sender, stake: amount}));
        }

        totalStakedTokens += amount;
        emit TokensStaked(msg.sender, amount);
    }

    /// @notice Select jurors randomly based on their stake
    function selectJurors(uint256 poolSize) external returns (address[] memory) {
        require(poolSize <= jurors.length, "Pool size exceeds juror count");

        address[] memory selectedJurors = new address[](poolSize);
        uint256[] memory weights = new uint256[](jurors.length);

        for (uint256 i = 0; i < poolSize; i++) {
            uint256 randomToken = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % totalStakedTokens;

            (uint256 jurorIndex, address jurorAddress) = getJurorByToken(randomToken);
            selectedJurors[i] = jurorAddress;
            weights[jurorIndex]++;
        }

        emit JurorsSelected(selectedJurors);
        return selectedJurors;
    }

    /// @notice Resolve a dispute and handle rewards and penalties
    function resolveDispute(address[] calldata voters, uint8[] calldata votes) external {
        require(voters.length == votes.length, "Voters and votes length mismatch");

        mapping(uint8 => uint256) memory voteCount;

        // Count votes for each option
        for (uint256 i = 0; i < votes.length; i++) {
            voteCount[votes[i]]++;
        }

        // Determine the majority vote
        uint8 majorityVote = 0;
        uint256 maxVotes = 0;
        for (uint8 i = 0; i < 256; i++) {
            if (voteCount[i] > maxVotes) {
                maxVotes = voteCount[i];
                majorityVote = i;
            }
        }

        address[] memory majorityVoters = new address[](voters.length);
        address[] memory minorityVoters = new address[](voters.length);

        uint256 majorityCount = 0;
        uint256 minorityCount = 0;
        uint256 majorityStake = 0;

        // Separate majority and minority voters
        for (uint256 i = 0; i < voters.length; i++) {
            if (votes[i] == majorityVote) {
                majorityVoters[majorityCount++] = voters[i];
                majorityStake += getJuror(voters[i]).stake;
            } else {
                minorityVoters[minorityCount++] = voters[i];
            }
        }

        // Apply penalties to minority voters by transferring tokens to the contract
        uint256 totalPenalty = 0;
        for (uint256 i = 0; i < minorityCount; i++) {
            Juror storage minorityJuror = getJuror(minorityVoters[i]);
            uint256 penalty = (minorityJuror.stake * 20) / 100;

            require(
                token.transferFrom(minorityJuror.addr, address(this), penalty),
                "Penalty transfer failed"
            );

            minorityJuror.stake -= penalty;
            totalStakedTokens -= penalty;
            totalPenalty += penalty;
        }

        // Distribute rewards to majority voters by transferring tokens from the contract
        for (uint256 i = 0; i < majorityCount; i++) {
            Juror storage majorityJuror = getJuror(majorityVoters[i]);
            uint256 reward = (majorityJuror.stake * totalPenalty) / majorityStake;

            majorityJuror.stake += reward;
            require(
                token.transfer(majorityJuror.addr, reward),
                "Reward transfer failed"
            );
        }

        // Emit event with final majority voters
        address[] memory finalMajorityVoters = new address[](majorityCount);
        for (uint256 i = 0; i < majorityCount; i++) {
            finalMajorityVoters[i] = majorityVoters[i];
        }

        emit DisputeResolved("Majority wins", finalMajorityVoters);
    }

    /// @notice Find the juror based on a random token index
    function getJurorByToken(uint256 token) internal view returns (uint256, address) {
        uint256 cumulativeStake = 0;
        for (uint256 i = 0; i < jurors.length; i++) {
            cumulativeStake += jurors[i].stake;
            if (token < cumulativeStake) {
                return (i, jurors[i].addr);
            }
        }
        revert("Token selection out of bounds");
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