import context from './contractContext';
import artifacts from "../artifacts/contracts/SampleERC5006.sol/SampleERC5006.json";

import shotenAddress from '../utility/shortenAddress'
import { useState } from 'react';
import { useEffect } from 'react';

const ethers = require('ethers');


let ContractState = (props) => {
    const [contract, setContract] = useState(null);
    const [account, setAcc] = useState({ address: null, balance: null });
    const [Provider, setProvider] = useState({ provider: null, signer: null });


    const contractAddress = '0xbb2dE0f9E901Bc4E7a6Dd6e6aa6173f29aAe7557';

    window.ethereum.on('accountsChanged', async function (accounts) {
        if (Provider.provider) {
            try {
                const _signer = await Provider.provider.getSigner();
                let _accAddress = await _signer.getAddress();
                //_accAddress = shortenAddress(_accAddress);
                let _accBalance = ethers.utils.formatEther(await _signer.getBalance());
                _accBalance = _accBalance.match(/^-?\d+(?:\.\d{0,2})?/)[0];
                setAcc({ address: _accAddress, balance: _accBalance });
                setProvider({ provider: Provider.provider, signer: _signer });
            } catch (error) {
                setAcc({ address: null, balance: null });
                console.log("error while handling change in account");
                console.log(error);
            }
        }
    })

    async function refreshDetails() {
        if (Provider.provider) {
            try {
                const _signer = await Provider.provider.getSigner();
                let _accAddress = await _signer.getAddress();
                //_accAddress = shortenAddress(_accAddress);
                let _accBalance = ethers.utils.formatEther(await _signer.getBalance());
                _accBalance = _accBalance.match(/^-?\d+(?:\.\d{0,2})?/)[0];
                setAcc({ address: _accAddress, balance: _accBalance });
                setProvider({ provider: Provider.provider, signer: _signer });
            } catch (error) {
                setAcc({ address: null, balance: null });
                console.log("error while handling change in account");
                console.log(error);
            }
        }
    }

    async function connectWallet() {
        // const _provider = new ethers.providers.JsonRpcProvider(`${localRpc}`);
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await _provider.send("eth_requestAccounts", []);
            const _signer = await _provider.getSigner();
            let _accAddress = await _signer.getAddress();
            //_accAddress = shortenAddress(_accAddress);
            let _accBalance = ethers.utils.formatEther(await _signer.getBalance());
            _accBalance = _accBalance.match(/^-?\d+(?:\.\d{0,2})?/)[0];
            setAcc({ address: _accAddress, balance: _accBalance });
            setProvider({ provider: _provider, signer: _signer });
            !(contract) && (await connectContract());

        } catch (error) {
            console.log("error while connecting with web3 provider");
            console.log(error);
        }


    }

    const contractFunction = {
        'mint': minToken,
        'markForRent': markForRent,
        'getMarkedRecords': getMarkedRecords,
        'removeRecord': removeMarkedRecord,
        'getBorrowedRecords': getBorrowedRecord,
        'getOnRentRecords': getOnRentRecords,
        'validateRecords': validateRecords,
        'getAllMarkedRecords': getAllMarkedRecords,
        'borrowToken': borrowToken,
        // 'getTxCount': getTxCount,
        // 'getAllTx': getAllTx
    }

    async function borrowToken(recId, price) {
        //validbalance
        try {
            const _signer = await Provider.provider.getSigner();
            let balance = (Number(await _signer.getBalance()));
            if (balance >= Number(ethers.utils.parseEther(price))) {
                let _contract = await contract.connect(Provider.signer);
                const options = { value: Number(ethers.utils.parseEther(price)) };
                const tx = await _contract.borrowToken(recId, options);

                await tx.wait() ? console.log("Successfully buyed record") : console.log("Error buying record");
            }
            else {
                throw ('Insufficient balance.')
            }
        } catch (error) {
            console.log('error while buying record');
            console.log(error);
        }
    }

    
    async function msgSender() {
        try {
            const _signer = await Provider.provider.getSigner();
            let _accAddress = await _signer.getAddress();
            return _accAddress;
        } catch (error) {
            console.log('error while getting msg sender');
            console.log(error);
        }
    }

    async function getBorrowedRecord() {
        try {
            let _contract = await contract.connect(Provider.signer);
            let recIds = await _contract.getBorrowedRecordId();
            let records = [];
            let expiredRecords = 0;

            const currentBlock = await Provider.provider.getBlockNumber();
            const timestamp = (await Provider.provider.getBlock(currentBlock)).timestamp;

            for (let i = 0; i < recIds.length; i++) {
                let record = await _contract._tokenRecords(Number(recIds[i]));

                if (!(Number(record.endTime) < timestamp)){
                    let obj = {
                        recordId: Number(recIds[i]),
                        lender: record.lender,
                        token_id: Number(record.tokenId),
                        copies: Number(record.copies),
                        price: ethers.utils.formatEther(ethers.BigNumber.from(`${record.price}`)),
                        startTime: Number(record.startTime),
                        endTime: Number(record.endTime),
                        lendedTo: shotenAddress(record.rentedTo),
                    }
                    
                    records.push(obj);
                }
                else{
                    expiredRecords++;
                }
            }

            console.log(`Records Expired ${expiredRecords}`);
            return (records);

        } catch (error) {
            console.log('error while getting marked records');
            console.log(error);
        }
    }

    async function getAllMarkedRecords() {
        try {
            let _contract = await contract.connect(Provider.signer);
            let recIds = await _contract._recId();
            let records = [];

            for (let i = 0; i < recIds; i++) {
                let record = await _contract._tokenRecords(i);
                let nullAddress = '0x0000000000000000000000000000000000000000';

                if (record.lender != nullAddress && record.lender != await msgSender() && record.rentedTo == nullAddress) {
                    let obj = {
                        recordId: Number(i),
                        lender: record.lender,
                        token_id: Number(record.tokenId),
                        copies: Number(record.copies),
                        price: ethers.utils.formatEther(ethers.BigNumber.from(`${record.price}`)),
                        startTime: Number(record.startTime),
                        endTime: Number(record.endTime)
                    }
                    records.push(obj);
                }
            }
            return (records);
        } catch (error) {
            console.log('error while getting marked records');
            console.log(error);
        }
    }

    async function getMarkedRecords() {
        try {
            let _contract = await contract.connect(Provider.signer);
            let tokenIds = await _contract.getLenderAvailableTokens();
            let records = [];

            for (let i = 0; i < tokenIds.length; i++) {
                let recordIds = await _contract.getMarkedRecordIds(Number(tokenIds[i]));

                for (let j = 0; j < recordIds.length; j++) {
                    let record = await _contract._tokenRecords(Number(recordIds[j]));
                    let obj = {
                        recordId: Number(recordIds[j]),
                        lender: record.lender,
                        token_id: Number(record.tokenId),
                        copies: Number(record.copies),
                        price: ethers.utils.formatEther(ethers.BigNumber.from(`${record.price}`)),
                        startTime: Number(record.startTime),
                        endTime: Number(record.endTime)
                    }
                    

                    records.push(obj);
                }
            }

            return (records);

        } catch (error) {
            console.log('error while getting marked records');
            console.log(error);
        }
    }

    async function getOnRentRecords() {
        try {
            let _contract = await contract.connect(Provider.signer);
            let tokenIds = await _contract.getLenderAvailableTokens();
            let records = [];

            for (let i = 0; i < tokenIds.length; i++) {
                let recordIds = await _contract.getOnRentRecordIds(Number(tokenIds[i]));
               
                
                for (let j = 0; j < recordIds.length; j++) {
                    let record = await _contract._tokenRecords(Number(recordIds[j]));
                    
                    let obj = {
                        recordId: Number(recordIds[j]),
                        lender: record.lender,
                        token_id: Number(record.tokenId),
                        copies: Number(record.copies),
                        price: ethers.utils.formatEther(ethers.BigNumber.from(`${record.price}`)),
                        startTime: Number(record.startTime),
                        endTime: Number(record.endTime),
                        lendedTo: shotenAddress(record.rentedTo),
                    }

                    records.push(obj);   
                    
                }
            }

            return (records);

        } catch (error) {
            console.log('error while getting onRent records');
            console.log(error);
        }
    }

    async function removeMarkedRecord(recId) {
        try {
            let _contract = await contract.connect(Provider.signer);
            const tx = await _contract.removeFromRent(recId);

            await tx ? console.log("Successfully removed marked record") : console.log("Error removing marked record");
        } catch (error) {
            console.log('error while removing marked record');
            console.log(error);
        }
    }

    async function markForRent(tokenId, copies, price, startTime, endTime) {
        try {
            let _contract = await contract.connect(Provider.signer);
            const tx = await _contract.markForRent(tokenId, copies, ethers.utils.parseEther(price), startTime, endTime);

            await tx ? console.log("Successfully marked for rent") : console.log("Error marking for rent");
        } catch (error) {
            console.log('error while marking token for rent');
            console.log(error);
        }
    }

    

    async function validateRecords() {
        try {
            let _contract = await contract.connect(Provider.signer);
            const tx = await _contract.validateLendedTokens();

            await tx ? console.log(`Successfully validated records (Removed: ${Number(tx)})`) : console.log("Error validating records record");
        } catch (error) {
            console.log('error while validating records record');
            console.log(error);
        }
    }

    async function minToken(copies) {
        try {
            let _contract = await contract.connect(Provider.signer);
            const res = await _contract.mintToken(copies);
            console.log("Token Minted ", res);
        } catch (error) {
            console.log('error while minting token');
            console.log(error);
        }
    }

    let connectContract = async () => {
        const _contract = await new ethers.Contract(contractAddress, artifacts.abi, Provider.provider);
        setContract(_contract);
    }

    useEffect(() => {
        // console.log("useEffect: updating account details");
        let updateDetails = async () => {
            connectWallet().then(() => {

            }).catch((error) => {
                console.log(error);
            });
        }
        updateDetails();
    }, [])


    return (
        <context.Provider value={{ contract, account, Provider, connectWallet, contractFunction }}>
            {props.children}
        </context.Provider>
    )
}

export { ContractState };