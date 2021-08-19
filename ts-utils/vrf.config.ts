import utils from './utils';
const {
    toWei
} = utils;

export default {
  keyHash: 
  {
    "Mainnet"   : '0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445', // mainnet
    "Rinkeby"   : '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311', // rinkeby
    "Kovan"     : '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4', // kovan
  },
  fee: 
  {
    "Mainnet"   : toWei('2'), // 2 LINK
    "Rinkeby"   : toWei('0.1'), // 0.1 LINK
    "Kovan"     : toWei('0.1'), // 0.1 LINK
  }, 
  vrfCoordinator: 
  {  
    "Mainnet"   : '0xf0d54349aDdcf704F77AE15b96510dEA15cb7952',
    "Rinkeby"   : '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B', 
    "Kovan"     : '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',  
  },
  link: 
  {
    "Mainnet"   : '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    "Rinkeby"   : '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    "Kovan"     : '0xa36085F69e2889c224210F603D836748e7dC0088',
  }
}; 