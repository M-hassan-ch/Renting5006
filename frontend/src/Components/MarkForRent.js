import React, { useState, useEffect, useContext } from "react";
import Context from "../context/contractContext";
import convertTime from "../utility/convertTime";
import Error from "./Error";
import { useForm } from "react-hook-form";

export default function MarkForRent() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  const [ShowError, setShowError] = useState(false);
  // let errors = [];

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const tknId = document.getElementById('tknId').value;
    const copies = document.getElementById('cpy').value;
    const price = document.getElementById('price').value;
    const start = new Date(document.getElementById('startt').value);
    const end = document.getElementById('end').value;

    try {
      if (parseInt(tknId)>=0){
        alert("Invalid");
      }
      else if (parseInt(start)>0 && parseInt(end)>0){
        alert("Timestamps should be greater than zero");
      }
      else if (parseInt(copies)>0){
        alert("copies should be greater than zero");
      }
      else if (parseInt(price)>0){
        alert("price should be greater than zero");
      }
      
    } catch (error) {
      alert("Inputs should be integer type");
    }
    // console.log(data);
  }

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
    console.log('iam clicked');
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
            <form className="px-3 py-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group mt-4 has-validation">
                <label htmlFor="name">
                  <b>Token Id</b>
                </label>
                <input
                  type="text"
                  className="form-control mt-2"
                  id="tknId"
                  placeholder="Id"
                  {...register("tknId", { required: true })}
                />
                {errors.tknId && <p style={{ color: "red" }}>Required</p>}
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
                  {...register("cpy", { required: true })}
                />
                {errors.cpy && <p style={{ color: "red" }}>Required</p>}
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
                  {...register("price", { required: true })}
                />
                {errors.price && <p style={{ color: "red" }}>Required</p>}
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
                  {...register("start", { required: true })}
                />
                {errors.start && <p style={{ color: "red" }}>Required</p>}
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
                  {...register("end", { required: true })}
                />
                {errors.end && <p style={{ color: "red" }}>Required</p>}
              </div>

              <button
                className="btn btn-primary mt-4 px-4 py-2"
                type="submit"
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
