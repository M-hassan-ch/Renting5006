import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';

export default function BorrowedRecord() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    let refresh = async()=>{
        if (context.contract) {
            console.log("Updating borrowed rec list........ ")
            contractFunction.getBorrowedRecords().then((result) => {
                setRecords(result);
                console.log("Updated borrowed rec list")
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
    }, [context.contract, context.account])


    function Card(props) {
        return (
            <>
                <div className="col-md-3 border border-primary">
                    <div>Record Id: {props.recId}</div>
                    <div>TokenId: {props.tknId}</div>
                    <div>Price: {props.price}</div>

                    <div><img src="" alt="" /></div>
                </div>
            </>
        )
    }
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Borrowed Records</h1>

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
