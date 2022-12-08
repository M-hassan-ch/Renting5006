import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';
import axios from 'axios';


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
          return resFile.data.IpfsHash;   
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
      // console.log("response1",responseFuncOne);
      setFileHash(responseFuncOne);
      const responseFuncTwo = await sendMetaDataToIPFS(responseFuncOne);
      // console.log("response2",responseFuncTwo)
      if (responseFuncTwo){
        setMetaDataHash(responseFuncTwo);  
        return responseFuncTwo;
      }
    }
    
  }
  
  const mintNft = async (e) => {
    const copies = document.getElementById('copies').value;
    try {
      if (parseInt(copies)>0 && File){
        setIsDisabled(true);
        let metaHash = await uploadDataToIPFS();
        
        if (metaHash){
          contractFunction.mint(metaHash, parseInt(copies)).then(()=>{
            setTimeout(()=>{
              setFileHash(null);
              setMetaDataHash(null);
              setIsDisabled(false);
            }, 3000);
          });
          
        }
        else{
          console.log("Error while uploading the files");
        }
        
      }
      else{
        throw("Cant mint Nft. invalid copy or null file");
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  
  
  return (
    <>
    <h2 style={{ textAlign: 'center' }}>logged in address: - {context.account.address}</h2>
    <h4 style={{ textAlign: 'center' }}>File Hash: {FileHash}</h4>
    <h4 style={{ textAlign: 'center' }}>Metadata Hash: {MetaDataHash}</h4>
    
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
  