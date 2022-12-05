import React, { useState, useEffect, useContext } from 'react';
import Context from '../context/contractContext';

export default function Marketplace() {
    const [Records, setRecords] = useState(null)
    const context = useContext(Context);
    const contractFunction = context.contractFunction;
    const [Enable, setEnable] = useState(true)

    let refresh = async () => {
      if (context.contract) {
          console.log("Updating marketplace rec list........ ")
          contractFunction.getAllMarkedRecords().then((result) => {
              setRecords(result);
              setEnable(false);
              console.log("Updated marketplace rec list")
          }).catch((err) => {
              console.log(err);
          });
      }
  };

    useEffect(() => {
        let temp = async () => {
            await refresh();
        }
        temp();
    }, [context.account])

    async function borrowRecord(recId, price){
      try {
        setEnable(true);
          contractFunction.borrowToken(recId, price).then(async()=>{
            await setTimeout(refresh, 3000);
          });
      } catch (error) {
          console.log(error);
      }
  }

    function Card(props) {
        return (
            <>
                <div className="col-md-3 border border-primary">
                    <div>TokenId: {props.tknId}</div>
                    <div>Price: {props.price}</div>
                    <div>Expiration time: {props.endTime}</div>

                    <div><img src="" alt="" /></div>
                    <div>
                    <div><button className="btn btn-primary mt-4 px-4 py-2" type='button' onClick={()=> borrowRecord(props.recId, props.price)} disabled = {Enable}><b>Borrow</b></button></div>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <h1 style={{ textAlign: 'center' }}>Marketplace Records</h1>

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
