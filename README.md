# Pre-IDO Lucky Draw Contract

## Description
The contract generates verifiable **on-chain** random numbers using **_ChainLink VRF_**. 

- The `setCandidatesInfo` function takes an array of the participant's addresses. 
- Upon triggering the `requestRandomNumber` function, a series of function calls will happen. 
- The winners of the lucky draw can be accessed via the `getwinners` function. 

The contract is supported on mainnet, rinkeby, and kovan. 

## Setup 
* Install `openzeppelin version @3.4.1` for compiler compatability:

```
$ npm install @openzeppelin/contracts@3.4.1
```
* Install ChainLink contracts: 
```
$ npm install @chainlink/contracts
```

## Development
* Compile:
```
npx hardhat compile
```

* Test
```
npx hardhat test
```

## Deployment
```
npx hardhat run scripts/VRF-deploy.ts 
```