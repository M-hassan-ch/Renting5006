import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';


export default function MarkForRent() {
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    const markForRent = async () => {
        const tknId = document.getElementById('tknId').value;
        const copies = document.getElementById('cpy').value;
        const price = document.getElementById('price').value;
        const start = document.getElementById('start').value;
        const end = document.getElementById('end').value;
        // console.log(context.contract);
        contractFunction.markForRent(parseInt(tknId),parseInt(copies), parseInt(price), parseInt(start),parseInt(end));
      }

    return (
        <>
            <h1 style={{textAlign:'center'}}>Mark For Rent</h1>

            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 shadow rounded border border-primary">
                        <form className='px-3 py-3'>
                            <div className="form-group mt-4">
                                <label htmlFor="name"><b>Token Id</b></label>
                                <input type="text" className="form-control mt-2" id="tknId" placeholder="Id" />
                            </div>

                            <div className="form-group mt-4">
                                <label htmlFor="desc"><b>Copies</b></label>
                                <input type="text" className="form-control mt-2" id="cpy" placeholder="copies" />
                            </div>

                            <div className="form-group mt-4">
                                <label htmlFor="desc"><b>Price</b></label>
                                <input type="text" className="form-control mt-2" id="price" placeholder="price" />
                            </div>

                            <div className="form-group mt-4">
                                <label htmlFor="desc"><b>Start Time</b></label>
                                <input type="text" className="form-control mt-2" id="start" placeholder="" />
                            </div>

                            <div className="form-group mt-4">
                                <label htmlFor="desc"><b>End Time</b></label>
                                <input type="text" className="form-control mt-2" id="end" placeholder="" />
                            </div>

                            <button className="btn btn-primary mt-4 px-4 py-2" type='button' onClick={markForRent}><b>Mark For Rent</b></button>
                        </form>
                    </div>
                </div>
            </div>
            <hr />
        </>
    )
}
