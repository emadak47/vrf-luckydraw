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
    candidatesArray,
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
    let _candidates;

    beforeEach(async() => {
        _fee = fee["kovan"];
        _link = link["kovan"];
        _keyHash = keyHash["kovan"];
        _vrfCoordinator = vrfCoordinator["kovan"];
        _candidates = candidatesArray();

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
    describe('Check const values of the Network kovan', () => {
        it('Should return a correct value for fee', () => {
            expect(_fee).to.equal(toWei('0.1'));
        });

        it('Should return a correct value for keyHash', () => {
            expect(_keyHash).to.equal('0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4');
        });      
        
        it('Should return a correct value for vrfCoordinator', () => {
            expect(_vrfCoordinator).to.equal('0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9');
        });

        it('Should return a correct value for LINK address', () => {
            expect(_link).to.equal('0xa36085F69e2889c224210F603D836748e7dC0088');
        });
    });

    // COMPLETE
    describe('setCandidatesInfo', () => {
        it('Should only allow the owner to modify it', async () => {
            await expect(vrfContract.connect(users.stranger)
            .setCandidatesInfo(_candidates)).to.be.revertedWith("Ownable: caller is not the owner");
        });

    });

    // COMPLETE
    describe('generateWinners', () => {
        it('Should select the required No. of winners', async () => {
            await vrfContract.setCandidatesInfo(_candidates);
            expect(await vrfContract.getCandidatesNumber()).to.equal(_candidates.length);
            await vrfContract.setWinnersNumber(10);
            
            // To mimic the behaviour of 'randomness'
            const random = Math.floor(Math.random() * (100000000000000));
            await vrfContract.generateWinners(random);

            const result = await vrfContract.getWinners(); 
            expect(result.length).to.equal(10);
        });
    })

    // COMPLETE
    describe('getCandidateInfo', () => {
        it('Should check if array and map are set correctly', async () => {
            await vrfContract.setCandidatesInfo(_candidates);
            expect(await vrfContract.getCandidatesNumber()).to.equal(_candidates.length);

            const random = Math.floor(Math.random() * (_candidates.length));
            const result = await vrfContract.getCandidateInfo(random); 

            expect(result.candidateAddressValue).to.equal(_candidates[random]);
            expect(result.selectedValue).to.equal(false);
        });
    });
    
    // COMPLETE
    describe('getLINKAddress()', () => {
        it('Should return the address of LINK token', async () => {
            expect(await vrfContract.getLINKAddress()).to.equal(_link);
        });
    });

    // COMPLETE 
    describe('getRequestFee()', () => {
        it('Should return the corresponding fee for the request', async () => {
            expect(await vrfContract.getRequestFee()).to.equal(_fee);
        })
    });
});