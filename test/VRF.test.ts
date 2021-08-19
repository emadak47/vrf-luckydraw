import { expect } from 'chai';
import { ethers } from 'hardhat';

import vrfConfig from '../ts-utils/vrf.config';
const {
    keyHash,
    fee,
    vrfCoordinator,
    link,
} = vrfConfig;

import utils from '../ts-utils/utils';
const {
    candidateArray,
    toWei,
    toEth,
    getTestUsers
} = utils;

describe('VRF contract', function() {
    // Deployment parameters 
    let users, vrfContract, token;
    // Constructor parameters 
    let _fee, _keyHash, _vrfCoordinator, _link;
    // Input parameters
    let _candidate;

    beforeEach(async() => {
        _fee = fee["Kovan"];
        _link = link["Kovan"];
        _keyHash = keyHash["Kovan"];
        _vrfCoordinator = vrfCoordinator["Kovan"];
        _candidate = candidateArray();

        token = await ethers.getContractFactory("VRF");
        users = await getTestUsers();
        vrfContract = await token.deploy(
            _vrfCoordinator, 
            _link, 
            _keyHash,
            _fee,
        );
        await vrfContract.deployed();
    });

    // COMPLETE
    describe('1. Check const values of the Network Kovan', () => {
        it('1.1 Should return a correct value for fee', () => {
            expect(_fee).to.equal(toWei('0.1'));
        });

        it('1.2 Should return a correct value for keyHash', () => {
            expect(_keyHash).to.equal('0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4');
        });      
        
        it('1.3 Should return a correct value for vrfCoordinator', () => {
            expect(_vrfCoordinator).to.equal('0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9');
        });

        it('1.4 Should return a correct value for LINK address', () => {
            expect(_link).to.equal('0xa36085F69e2889c224210F603D836748e7dC0088');
        });
    });

    // COMPLETE
    describe('2. setCandidatesArray', () => {
        it('2.1 Should only allow the owner to modify it', async () => {
            await vrfContract.setNoOfCandidates(_candidate.length);
            await expect(vrfContract.connect(users.stranger)
            .setCandidateInfo(_candidate)).to.be.revertedWith("Has to be owner");
        });

        it('2.2 Should revert if No. of entries in _candidates is different from _NoOfCandidates passed to Constructor', async () => {
            await vrfContract.setNoOfCandidates(_candidate.length - 1);

            await expect(vrfContract.setCandidateInfo(_candidate))
            .to.be.revertedWith("Number of entries in the array _candidate doesn't match the NoOfCandidates");
        });
    });

    // COMPLETE
    describe('3. generateWinners', () => {
        it('3.1 Should select the required No. of winners', async () => {
            await vrfContract.setNoOfCandidates(_candidate.length);
            await vrfContract.setCandidateInfo(_candidate);

            await vrfContract.setNoOfWinners(10);
            
            // To mimic the behaviour of randomness
            const random = Math.floor(Math.random() * (100000000000000));
            await vrfContract.generateWinners(random);

            const result = await vrfContract.getWinnersList();
            expect(result.length).to.equal(10);
        });
    })

    // COMPLETE
    describe('4. getCandidateInfo', () => {
        it('4.1 Should check if array and map are set correctly', async () => {
            await vrfContract.setNoOfCandidates(_candidate.length);
            await vrfContract.setCandidateInfo(_candidate);
            
            const random = Math.floor(Math.random() * (_candidate.length));
            const result = await vrfContract.getCandidateInfo(random); 

            expect(result.candidateAddressValue).to.equal(_candidate[random]);
            expect(result.selectedValue).to.equal(false);
        });
    });
    
    // COMPLETE
    describe('5. getLINKAddress()', () => {
        it('6.1 Should return the address of LINK token', async () => {
            expect(await vrfContract.getLINKAddress()).to.equal(_link);
        });
    });

    // COMPLETE 
    describe('6. getRequestFee()', () => {
        it('7.1 Should return the corresponding fee for the request', async () => {
            expect(await vrfContract.getRequestFee()).to.equal(_fee);
        })
    });
});