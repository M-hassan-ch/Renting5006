import context from './contractContext';
import artifacts from "../artifacts/contracts/SampleERC5006.sol/SampleERC5006.json";
import { useState } from 'react';
import { useEffect } from 'react';

const ethers = require('ethers');


let ContractState = (props) => {
    const [contract, setContract] = useState(null);
    const [account, setAcc] = useState({ address: null, balance: null });
    const [Provider, setProvider] = useState({ provider: null, signer: null });


    const contractAddress = '0xE58b68471d20d3159d7b50130174804456a5Cf78';

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
        // 'getTxCount': getTxCount,
        // 'getAllTx': getAllTx
    }

    async function markForRent(tokenId, copies, price, startTime, endTime) {
        try {
            let _contract = await contract.connect(Provider.signer);
            const tx = await _contract.markForRent(tokenId, copies, price, startTime, endTime);

            await tx ? console.log("Successfully marked for rent") : console.log("Error marking for rent");

            // let struct_tx = tx.map((transaction) => {
            //    if (transaction.sender == account.address) {
            //         return {
            //             addressTo: transaction.receiver,
            //             addressFrom: transaction.sender,
            //             timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            //             message: transaction.message,
            //             keyword: transaction.keyword,
            //             amount: parseInt(transaction.amount._hex) / (10 ** 18)
            //         }
            //    }
            // });

            // return struct_tx;
        } catch (error) {
            console.log('error while marking token for rent');
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
                        token_id:  Number(record.tokenId),
                        copies:  Number(record.copies),
                        price:  Number(record.price),
                        startTime:  Number(record.startTime),
                        endTime:  Number(record.endTime)
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

    async function sendTransaction(obj) {
        try {
            let _contract = await contract.connect(Provider.signer);
            const tx = await _contract.transfer(obj.addr, obj.msg, obj.keyword, { value: ethers.utils.parseEther(obj.amount) });
            await tx.wait();
            await refreshDetails();
            // console.log(tx);
        } catch (error) {
            console.log('error while sending transaction');
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