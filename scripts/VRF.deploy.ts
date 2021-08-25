import { ethers } from 'hardhat';

import vrfConfig from '../ts-utils/vrf.config';
const {
    keyHash,
    fee,
    vrfCoordinator,
    link,
} = vrfConfig;

import utils from '../ts-utils/utils';
const { getTestUsers } = utils;

async function main() {

    const users = await getTestUsers();
  
    console.log(
      "Deploying contracts with the account:",
      users.deployer.address
    );

    const feeValue = fee["Kovan"];
    const keyHashValue = keyHash["Kovan"];
    const vrfCoordinatorValue = vrfCoordinator["Kovan"];
    const linkValue = link["Kovan"];
    
    console.log("Account balance:", (await users.deployer.getBalance()).toString());
      
    const token = await ethers.getContractFactory("VRF");
    const vrfContract = await token.deploy(
      vrfCoordinatorValue, 
      linkValue, 
      keyHashValue,
      feeValue,
    );
    await vrfContract.deployed();
  
    console.log("vrfContract address:", vrfContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });