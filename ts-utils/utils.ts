import { ethers } from "hardhat";
import CandidateAddressJson from "./CandidateAddress.json";

const candidateArray = () => {
  return CandidateAddressJson;
}

const toWei = ethers.utils.parseEther;
const toEth = ethers.utils.formatEther;

const getTestUsers = async () => {
    let [deployer, vrfCoordinator, user1, user2, stranger] = await ethers.getSigners();
    return {deployer, vrfCoordinator, user1, user2, stranger};
}

export default {
  candidateArray,
  toWei,
  toEth,
  getTestUsers
}