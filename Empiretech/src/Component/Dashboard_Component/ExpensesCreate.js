import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createExpenses } from "../../Context/DbContext";
import Moment from "moment";

var expensesData = [];

export default function TransferCreate() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => submitData(data, userInfo, expensesData);
  const history = useHistory();
  const [state, setstate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [row, setRow] = useState(1);

  const userInfo = JSON.parse(localStorage.getItem("user"));

  function reject(e) {
    if (e.target.max > e.target.value) return e.preventDefault();

    return null;
  }

  function addItem() {
    setstate(true);
    if (expensesData.length === 0) return expensesData.push(0);
    var x = expensesData.length;
    expensesData.push(x);
  }

  const getQty = async (props, idx) => {
    if (idx === undefined) {
      idx = 1;
      props = 1;
    }

    if (props < 1 && props !== "") {
      expensesData.splice(idx, 1);
      return setstate(true);
    }

    getPrice(idx);
    return props;
  };

  const getPrice = (idx) => {
    var test = 0;
    test = getValues(`expenses[${idx}].Qty`) * getValues(`expenses[${idx}].UnitPrice`);
    if (Number.isNaN(test)) test = 1;
    setValue(`expenses[${idx}].Total`, test);
    setstate(true);
  };

  async function submitData(data, UserInfo, expensesData) {
    setstate(true);
    if (expensesData.length <= 0) {
      return setError(true);
    }

    try {
      //setError("");
      setError(false);
      setLoading(true);
      createExpenses(data, UserInfo);
      setComplete(true);
    } catch {
      //setError("Duplicate Product Code");
    }

    setLoading(false);
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && !error && complete) {
        if (countdown === 0) {
          history.push("/Dashboard/Expenses");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (state) {
      setRow(row + 1);
      getPrice(row);
      var x = 0;
      expensesData.map((code, idx) => (x = x + parseFloat(getValues(`expenses[${idx}].Total`))));
      setValue("SubTotal", x);
    }
    return setstate(false);
  }, [state, setRow, row, setValue, getValues]);

  return (
    <div>
      {isSubmitSuccessful && !error && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Expenses Recorded Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}

      {(!isSubmitSuccessful || !complete) && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Expenses Record Form</h1>
          <div className="flex flex-col mt-0">
            <h1 className="font-semibold text-lg text-gray-800">Staff : {userInfo.Staff_Nickname}</h1>
            <h1 className="font-semibold text-lg text-gray-800">
              Date : {Moment(Date.now()).format("DD/MM/yyyy hh:mm")}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col items-baseline">
            <label htmlFor="Ref" className="flex mr-3 font-semibold text-lg text-gray-800">
              Reference No :
            </label>
            <input
              id="Ref"
              name="Ref"
              type="text"
              autoComplete="Ref"
              onKeyPress={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              ref={register}
              required
              className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full lg:w-auto border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            ></input>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                addItem();
              }}
              className="group relative ml-auto lg:mt-0 mt-5 justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </div>
          <div className="flex">
            <table className="border-collapse w-full lg:mt-0 ">
              <thead className="text-center hidden lg:table-header-group border-2">
                <tr>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    No
                  </th>
                  <th className="p-3 lg:w-auto font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Description
                  </th>
                  <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Qty
                  </th>
                  <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Unit Price
                  </th>
                  <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {expensesData.map((code, idx) => (
                  <tr
                    key={idx}
                    className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0"
                  >
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        No
                      </span>
                      {idx + 1}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-8 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Description
                      </span>
                      <input
                        className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full flex-grow border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        name={`expenses[${code}].Description`}
                        type="text"
                        ref={register}
                        required
                        onKeyPress={(e) => {
                          e.key === "Enter" && reject(e);
                        }}
                      />
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Qty
                      </span>
                      <input
                        className="appearance-none md:mt-2 rounded-md px-3 py-2 w-2/3 flex-grow border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        defaultValue={1}
                        name={`expenses[${code}].Qty`}
                        type="number"
                        min={1}
                        ref={register}
                        required
                        onChange={(e) => getQty(e.target.value, code)}
                        onKeyPress={(e) => {
                          e.key === "Enter" && reject(e);
                        }}
                      />
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Unit Price
                      </span>
                      <input
                        className="appearance-none md:mt-2 rounded-md px-3 py-2 w-2/3 flex-grow border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        defaultValue={0}
                        name={`expenses[${code}].UnitPrice`}
                        type="number"
                        min={0}
                        ref={register}
                        required
                        onChange={(e) => getPrice(code)}
                        onKeyPress={(e) => {
                          e.key === "Enter" && reject(e);
                        }}
                      />
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Total
                      </span>
                      <input
                        className="appearance-none md:mt-2 rounded-md px-3 py-2 w-2/3 flex-grow border bg-gray-200 text-gray-900 focus:z-10 sm:text-sm"
                        name={`expenses[${code}].Total`}
                        type="number"
                        defaultValue="0"
                        ref={register}
                        required
                        readOnly={true}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col lg:flex-row ml-auto items-baseline">
            <label htmlFor="Ref" className="flex lg:ml-auto mr-3 font-semibold text-lg text-gray-800">
              Total :
            </label>
            <input
              id="SubTotal"
              name="SubTotal"
              type="number"
              autoComplete="SubTotal"
              defaultValue={0}
              readOnly
              ref={register}
              className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full lg:w-auto border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            onClick={() => {}}
            className="group relative justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Expenses
          </button>
        </form>
      )}
    </div>
  );
}
