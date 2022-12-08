import React, { useState, useEffect, useContext } from "react";
import Context from "../context/contractContext";
import convertTime from "../utility/convertTime";
import Error from "./Error";

export default function MarkForRent() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const [ShowError, setShowError] = useState(false);
  let errors = [];

  // const validateForm = () => {
  //     console.log('verif');
  //     const tknId = document.getElementById('tknId').value;
  //     const copies = document.getElementById('cpy').value;
  //     const price = document.getElementById('price').value;
  //     const start = new Date(document.getElementById('startt').value);
  //     const end = document.getElementById('end').value;

  //     if (tknId === ''){
  //         errors.push("Empty Text Fields");
  //         setShowError(true)
  //         return
  //     }

  //     setShowError(false);
  // }

  const markForRent = async () => {
    const tknId = document.getElementById("tknId").value;
    const copies = document.getElementById("cpy").value;
    const price = document.getElementById("price").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    // const currentTime = Math.floor(Date.now() / 1000);
    // const startTime = convertTime(start);
    // const endTime = convertTime(end);

    // if (startTime < currentTime) {
    //   console.log("Start Time cannot be less than cuuren time");
    // }
    // if
    // console.log(start);
    // convertTime(start);
    // console.log(context.contract);

    console.log(start, end);
    // contractFunction.markForRent(
    //   tknId,
    //   copies,
    //   price,
    //   start,
    //   end
    // );
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Mark For Rent</h1>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 shadow rounded border border-primary">
            <form className="px-3 py-3 needs-validation">
              <div className="form-group mt-4 has-validation">
                <label htmlFor="name">
                  <b>Token Id</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="tknId"
                  placeholder="Id"
                />
              </div>

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>Copies</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="cpy"
                  placeholder="copies"
                />
              </div>

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>Price</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="price"
                  placeholder="price"
                />
              </div>

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>Start Time</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="start"
                  placeholder=""
                />
              </div>

              {/* <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>Start Time</b>
                </label>
                <input
                  type="datetime-local"
                  className="form-control mt-2"
                  id="startt"
                  placeholder=""
                />
              </div> */}

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>End Time</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="end"
                  placeholder=""
                />
              </div>

              <button
                className="btn btn-primary mt-4 px-4 py-2"
                type="button"
                onClick={markForRent}
              >
                <b>Mark For Rent</b>
              </button>
            </form>
          </div>
        </div>
      </div>

      <hr />
    </>
  );
}
