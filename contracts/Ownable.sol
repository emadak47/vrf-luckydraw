pragma solidity ^0.6.0;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;
    address public proposedOwner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Has to be owner");
        _;
    }

    function transferOwnership(address _proposedOwner) public onlyOwner {
        require(msg.sender != _proposedOwner, "Has to be diff than current owner");
        proposedOwner = _proposedOwner;
    }

    function claimOwnership() public {
        require(msg.sender == proposedOwner, "Has to be the proposed owner");
        emit OwnershipTransferred(owner, proposedOwner);
        owner = proposedOwner;
        proposedOwner = address(0);
    }
}
