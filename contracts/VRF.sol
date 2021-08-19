//SPDX-License-Identifier: Unlicense

pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./SafeMath.sol";
import "./Ownable.sol";

contract VRF is VRFConsumerBase, Ownable {

    using SafeMath for uint256;

    bytes32 public keyHash;
    uint256 public fee;
    uint32 public NoOfCandidates;
    uint32 public NoOfWinners;

    address[] public candidate;
    address[] public Winners;
    mapping (address => bool) selected;

    event vrfRequested(bytes32 indexed VRFRequestID);
    event randomNumberrequested(address someone);
    event randomNumberReceived(uint256 indexed randomness);

    constructor(
        address _VRFCoordinator, 
        address _LINK, 
        bytes32 _keyHash, 
        uint256 _fee
    ) public VRFConsumerBase(_VRFCoordinator, _LINK) {
        keyHash = _keyHash;
        fee = _fee;
    }

    function setNoOfCandidates(uint32 _NoOfCandidates) public {
        NoOfCandidates = _NoOfCandidates;
    }

    function setNoOfWinners(uint32 _NoOfWinners) public {
        NoOfWinners = _NoOfWinners;
    }

    function setCandidateInfo(address[] memory _candidate) public onlyOwner {
        require (NoOfCandidates == _candidate.length, "Number of entries in the array _candidate doesn't match the NoOfCandidates");
        candidate = _candidate;  
        for (uint i = 0; i < candidate.length; i++) {
            selected[candidate[i]] = false;
        }
    }

    function requestRandomNumber() public {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK in contract");
        bytes32 VRFRequestID = requestRandomness(keyHash, fee);
        emit vrfRequested(VRFRequestID);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        generateWinners(randomness);
        emit randomNumberReceived(randomness); 
    }

    function generateWinners(uint256 randomness) public {
        uint counter = 0;
        for (uint i = 0; i < SafeMath.mul(NoOfWinners, 2); i++) {
            
            uint256 randomNumber = SafeMath.mod(
                uint256(keccak256(abi.encode(randomness, i))),
                NoOfCandidates
            );

            if(!selected[candidate[randomNumber]]) {
                selected[candidate[randomNumber]] = true;
                Winners.push(candidate[randomNumber]);
                counter = SafeMath.add(counter, 1);
            } 

            if (counter == NoOfWinners) break;
        }
    }

    function getNoOfCandidates() public view returns(uint32) {
        return NoOfCandidates;
    }

    function getNoOfWinners() public view returns(uint32) {
        return NoOfWinners;
    }

    function getWinnersList() public view returns(address[] memory) {
        return Winners;
    }
    
    function getCandidateInfo(uint32 id) public view returns(address candidateAddressValue, bool selectedValue) {
        return(
            candidate[id],
            selected[candidate[id]]
        );
    }
    
    function getLINKAddress() external view returns(address) {
        return address(LINK);
    }

    function getRequestFee() external view returns(uint256) {
        return fee;
    }
}