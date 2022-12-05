import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';


// https://gateway.pinata.cloud/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

//https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u

export default function CreateNft() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const [file, setFile] = useState(null);

  const mintNft = async (e) => {
    const copies = document.getElementById('copies').value;
    // console.log(context.contract);
    try {
      if (parseInt(copies)>0){
//

//  
contractFunction.mint(parseInt(copies));
      }
      else{
        throw("Invalid no. of copies");
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  }

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

              <button className="btn btn-primary mt-4 px-4 py-2" type='button' onClick={mintNft}><b>create</b></button>
            </form>
          </div>
        </div>
      </div>
      <hr />
      {/* <img src="https://ipfs.io/ipfs/QmYXEZGtq2pSS7ESzSxHvzqWBokqAmwSB6UiEJAzx8CM2u" alt="" /> */}

    </>
  )
}
