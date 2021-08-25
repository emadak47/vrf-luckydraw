import "@nomiclabs/hardhat-waffle";
import "@openzeppelin/hardhat-upgrades";

import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
  networks: {
    kovan: {
      url: "", // infura or alchemy node url
      accounts: [] // private key 
    }
  }
};

export default config;