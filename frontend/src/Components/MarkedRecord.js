import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';

export default function MarkedRecord() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    let refresh = async()=>{
        if (context.contract) {
            console.log("Updating marked rec list........ account, contract change detected")
            contractFunction.getMarkedRecords().then((result) => {
                setRecords(result);
                console.log("Updated marked rec list")
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        let temp = async () => {
            await refresh();        
        }
        temp();
    }, [])

    async function removeRecord(recId){
        try {
            contractFunction.removeRecord(recId);
            await setTimeout(refresh, 4000);
        } catch (error) {
            console.log("Error while removing the records");
            console.log(error);
        }
    }
    function Card(props) {
        return (
            <>
                <div className="col-md-3 border border-primary">
                    <div>Record Id: {props.recId}</div>
                    <div>TokenId: {props.tknId}</div>
                    <div>Price: {props.price}</div>
                    <div>Expiration time: {props.endTime}</div>

                    <div><img src="" alt="" /></div>
                    <div><button className="btn btn-danger mt-4 px-4 py-2" type='button' onClick={()=> removeRecord(props.recId)}><b>Remove</b></button></div>
                </div>
            </>
        )
    }

    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Marked Record</h1>

            <div className="container">
                <div className="row">
                    {Records && Records.map((obj, i) => {
                        return <Card key={i} recId={obj.recordId} tknId={obj.token_id} copies={obj.copies} startTime={obj.startTime} endTime={obj.endTime} price={obj.price} />
                    })}
                </div>
            </div>
            <hr />
        </>
    )
}
