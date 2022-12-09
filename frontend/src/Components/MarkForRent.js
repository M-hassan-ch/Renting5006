import React, { useState, useEffect, useContext } from "react";
import Context from "../context/contractContext";
import convertTime from "../utility/convertTime";
import { useForm } from "react-hook-form";

export default function MarkForRent() {
  const context = useContext(Context);
  const contractFunction = context.contractFunction;
  // let errors = [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    const tknId = document.getElementById("tknId").value;
    const copies = document.getElementById("cpy").value;
    const price = document.getElementById("price").value;
    const start = new Date(document.getElementById("start").value);
    const end = document.getElementById("end").value;
    const currentTime = Math.floor(Date.now() / 1000);

    try {
      if (parseInt(tknId) < 0) {
        alert("Invalid");
      } else if (convertTime(start) + 60 <= currentTime) {
        // console.log(convertTime(start), currentTime);
        alert("start time should be greater than current time");
      } else if (convertTime(end) <= currentTime) {
        alert("end time should be greater than current time");
      } else if (parseInt(copies) <= 0) {
        alert("copies should be greater than zero");
      } else if (parseFloat(price) <= 0 || parseFloat(price) == 0) {
        alert("price should be greater than zero");
      } else {
        contractFunction.markForRent(
          tknId,
          copies,
          price,
          convertTime(start),
          convertTime(end)
        );
      }
    } catch (error) {
      alert("Error while parsing the inputs");
      console.log(error);
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Mark For Rent</h1>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 shadow rounded border border-primary">
            <form
              className="px-3 py-3 needs-validation"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                  type="datetime-local"
                  className="form-control mt-2"
                  id="start"
                  placeholder=""
                  {...register("start", { required: true })}
                />
                {errors.start && <p style={{ color: "red" }}>Required</p>}
              </div>

              <div className="form-group mt-4">
                <label htmlFor="desc">
                  <b>End Time</b>
                </label>
                <input
                  type="datetime-local"
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
