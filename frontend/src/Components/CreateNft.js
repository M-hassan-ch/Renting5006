import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';
import axios from 'axios';
import { reject, template } from 'underscore';
import { resolvePath } from 'react-router-dom';


// https://gateway.pinata.cloud/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

//https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

export default function CreateNft() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const [File, setFile] = useState(null);
  const [FileHash, setFileHash] = useState(null);
  const [MetaDataHash, setMetaDataHash] = useState(null);
  const [IsDisabled, setIsDisabled] = useState(false);
  
  const handleFileUpload = async(e) => {
    console.log('handling file upload');
    setFile(e.target.files[0]);
  }
  
  const sendFileToIPFS = async (data, fileName) => {
    try {
      console.log('got file ', File);
      const formData = new FormData();
      formData.append('file', data, fileName);
      
      console.log('sending file to IPFS..........');
      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",//pinJSONToIPFS
        data: formData,
        headers: {
          'pinata_api_key': `5118d12a0f3128be332d`,//${process.env.REACT_APP_PINATA_API_KEY}
          'pinata_secret_api_key': `8660c87818cb1522c2c08d141ed393eeff441cad866f34da9775816bbdbbd809`,//${process.env.REACT_APP_PINATA_API_SECRET}
          "Content-Type": "multipart/form-data"
        },
      });
      
      if (resFile){
        // const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
        setFileHash(resFile.data.IpfsHash);
        return resFile.data.IpfsHash
        // console.log("File successfully sent to IPFS", ImgHash);
        
      }
    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
    }
  }
  
  const sendMetaDataToIPFS = async (filehash) => {
    try {   
      if (filehash){
        const metaData= JSON.stringify({
          name: document.getElementById('name').value,
          description: document.getElementById('desc').value,
          data: filehash
        });
        
        console.log('sending json to IPFS..........');
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",//pinFileToIPFS
          data: metaData,
          headers: {
            'pinata_api_key': `5118d12a0f3128be332d`,//${process.env.REACT_APP_PINATA_API_KEY}
            'pinata_secret_api_key': `8660c87818cb1522c2c08d141ed393eeff441cad866f34da9775816bbdbbd809`,//${process.env.REACT_APP_PINATA_API_SECRET}
            "Content-Type": "application/json"
          },
        });
        
        if (resFile){
          const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
          setMetaDataHash(resFile.data.IpfsHash);
          return resFile.data.IpfsHash
          console.log("json successfully sent to IPFS", ImgHash);       
        }
      }
      else{console.log('Error. null file hash');}
    } catch (error) {
      console.log("Error sending File to IPFS: ")
      console.log(error)
    }
  }
  
  async function uploadDataToIPFS(){
    
    const responseFuncOne = await sendFileToIPFS(File, File.name);
    if(responseFuncOne){
    console.log("response1",responseFuncOne);
      const responseFuncTwo = await sendMetaDataToIPFS(responseFuncOne);
    console.log("response2",responseFuncTwo)

    }
    // let promise1 = new Promise((resolve,reject)=>{
    //   sendFileToIPFS(File, File.name).then(()=>{
    //     resolve(1);
    //   }).catch((error)=>{
    //     reject(-1);
    //     console.log(error);
    //   })
    // })
    
    // let promise2 = new Promise((resolve,reject)=>{
    //   sendMetaDataToIPFS().then(()=>{
    //     resolve(1);
    //   }).catch((error)=>{
    //     reject(-1);
    //     console.log(error);
    //   })
    // })
    
    // promise1.then(()=>{
    //   promise2.then(()=>{
    //     console.log('Data uploaded succesfully');
    //   }).catch((error)=>{
    //     console.log("Json upload Promise Rejected: - ", error);
    //   });
    // }).catch((error)=>{
    //   console.log("File upload Promise Rejected: - ", error);
    // });
    // sendFileToIPFS(File, File.name).then(async()=>{
    //   if (FileHash){
    //     await sendMetaDataToIPFS()
    //   }
    // });
    
  }
  
  const mintNft = async (e) => {
    const copies = document.getElementById('copies').value;
    try {
      if (parseInt(copies)>0 && File){
        setIsDisabled(true);
        await uploadDataToIPFS();    
        // tokens will be minted on useEffect
      }
      else{
        throw("Cant mint Nft. invalid copy or null file");
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  
  useEffect(() => {
    if (FileHash!=null && MetaDataHash!=null){
      console.log("File ", FileHash);
      console.log("metadata", MetaDataHash);
      setTimeout(()=>{
        setFileHash(null);
        setMetaDataHash(null);
        setIsDisabled(false);
      }, 3000);
      // contractFunction.mint(parseInt(copies)).then(()=>{
      //   setTimeout(()=>{
      //     setFileHash(null);
      //     setMetaDataHash(null);
      //     isDisabled = false;
      //   }, 3000);
      // });
    }
  }, [FileHash, MetaDataHash])
  
  
  return (
    <>
    <h2 style={{ textAlign: 'center' }}>logged in address: - {context.account.address}</h2>
    <div className="container mt-5">
    <div className="row justify-content-center">
    <div className="col-md-6 shadow rounded border border-primary">
    <form className='px-3 py-3'>
    <div className="form-group mt-4">
    <label htmlFor="name"><b>NFT Name</b></label>
    <input type="text" className="form-control mt-2" id="name" placeholder="name" />
    </div>
    
    <div className="form-group mt-4">
    <label htmlFor="desc"><b>Description</b></label>
    <input type="text" className="form-control mt-2" id="desc" placeholder="details" />
    </div>
    
    <div className="form-group mt-4">
    <label htmlFor="copies"><b>Copies</b></label>
    <input type="text" className="form-control mt-2" id="copies" placeholder="copies" />
    </div>
    
    <div className="form-group mt-4">
    <label htmlFor="file"><b>Asset</b></label>
    <input type="file" className="form-control form-control-file mt-2" id="file" onChange={handleFileUpload} />
    </div>
    
    <button className="btn btn-primary mt-4 px-4 py-2" type='button' onClick={mintNft} disabled={IsDisabled}><b>Mint</b></button>
    </form>
    </div>
    </div>
    </div>
    <hr />
    {/* <img src="https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u" alt="" /> */}
    
    </>
    )
  }
  