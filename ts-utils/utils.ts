import {ethers} from "hardhat";
import CandidateAddressJson from "./CandidateAddress.json";
import {getTestUsers} from "../test/utils";

const candidatesArray = () => {
  return CandidateAddressJson;
}

const toWei = ethers.utils.parseEther;
const toEth = ethers.utils.formatEther;

export default {
  candidatesArray,
  toWei,
  toEth,
  getTestUsers
}