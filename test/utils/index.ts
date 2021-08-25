import {ethers} from "hardhat";

export const getTestUsers = async () => {
    let [deployer, vrfCoordinator, user1, user2, stranger] = await ethers.getSigners();
    return {deployer, vrfCoordinator, user1, user2, stranger};
}