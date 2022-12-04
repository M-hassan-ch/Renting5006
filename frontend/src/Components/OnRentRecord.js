import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';

export default function OnRentRecord() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;

    let refresh = async () => {
        if (context.contract) {
            console.log("Updating onRent rec list........")
            contractFunction.getOnRentRecords().then((result) => {
                setRecords(result);
                console.log("Updated onRent rec list")
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        let temp = async () => {
            await setTimeout(refresh, 5000);
        }
        temp();
    }, [context.contract, context.account])

    // async function removeRecord(recId){
    //     try {
    //         contractFunction.removeRecord(recId);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async function validate(){
        contractFunction.validateRecords().then(async()=>{
            await refresh()
        });
    }

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
            <h1 style={{ textAlign: 'center' }}>OnRent Record</h1>


            <div className="container">
                <div className="row justify-content-end">
                    {
                        Records && Records.length && (
                            <div className="col-md-1 ">
                                <button className="btn btn-danger" onClick={validate}>Validate</button>
                            </div>
                        )
                    }


                </div>
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
