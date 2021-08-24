//SPDX-License-Identifier: MIT

pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VRF is VRFConsumerBase, Ownable {

    using SafeMath for uint256;

    bytes32 public keyHash;
    uint256 public fee;

    /// @dev expected number of candidates 
    uint32 public candidatesNumber;

    /// @dev number of winners 
    uint32 public winnersNumber;

    /// @dev an array to contain 'candidatesNumber' addresses 
    address[] public candidates;

    /// @dev an array to be filled in with 'winnersNumber' addresses
    address[] public winners;

    /// @dev mapping to indicate which addresses have been added to winners
    mapping (address => bool) selected;

    event RandomNumberRequested(bytes32 indexed vrfRequestID);
    event RandomNumberReceived(bytes32 indexed requestId, uint256 indexed randomness);

    constructor(
        address _vrfCoordinator, 
        address _link, 
        bytes32 _keyHash, 
        uint256 _fee
    ) public VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        fee = _fee;
    }

    function setCandidatesNumber(uint32 _candidatesNumbers) public {
        candidatesNumber = _candidatesNumbers;
    }

    function setWinnersNumber(uint32 _winnersNumber) public {
        winnersNumber = _winnersNumber;
    }

    /** 
     * @notice instantiate the 'candidates' array and the mapping 'selected'
     * @dev number of entries in _candidates must match the set number of candidates in 'candidatesNumber' 
     */
    function setCandidatesInfo(address[] memory _candidates) public onlyOwner {
        require (candidatesNumber == _candidates.length, "Number of entries in _candidates doesn't match the candidatesNumber");
        candidates = _candidates;  
        for (uint i = 0; i < candidates.length; i++) {
            selected[candidates[i]] = false;
        }
    }
    
    function requestRandomNumber() public {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in contract");
        bytes32 vrfRequestID = requestRandomness(keyHash, fee);
        emit RandomNumberRequested(vrfRequestID);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        generateWinners(randomness);
        emit RandomNumberReceived(requestId, randomness); 
    }

    /**
     * @notice generate 2x expected number of winners. Only consider the first 'winnersNumber' who have not been selected
     * @dev getting multiple random numbers within a given range from a single VRF response
     */
    function generateWinners(uint256 randomness) public {
        uint counter = 0;
        uint width = SafeMath.mul(winnersNumber, 2);

        for (uint i = 0; i < width; i++) {
            // range (0, candidatesNumber)
            uint256 randomNumber = SafeMath.mod(
                uint256(keccak256(abi.encode(randomness, i))),
                candidatesNumber
            );

            if(!selected[candidates[randomNumber]]) {
                selected[candidates[randomNumber]] = true;
                winners.push(candidates[randomNumber]);
                counter = SafeMath.add(counter, 1);
            } 

            if (counter == winnersNumber) break;
        }
    }

    function getCandidatesNumber() public view returns(uint32) {
        return candidatesNumber;
    }

    function getWinnersNumber() public view returns(uint32) {
        return winnersNumber;
    }

    function getWinners() public view returns(address[] memory) {
        return winners;
    }
    
    function getCandidateInfo(uint32 id) public view returns(address candidateAddressValue, bool selectedValue) {
        return(
            candidates[id],
            selected[candidates[id]]
        );
    }
    
    function getLINKAddress() external view returns(address) {
        return address(LINK);
    }

    function getRequestFee() external view returns(uint256) {
        return fee;
    }

    /// @notice to avoid locking funds within the contract
    function withdrawLink() external onlyOwner {
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer funds out of contract");
    }
}