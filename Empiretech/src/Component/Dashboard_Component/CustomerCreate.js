import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createCustomer } from "../../Context/DbContext";
import { useHistory, useLocation } from "react-router-dom";

export default function CustomerCreate() {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm();
  const history = useHistory();

  const onSubmit = (data) => submitData(data);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("Sales");

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && complete) {
        if (countdown === 0) {
          if (query === "1") return history.replace("/Dashboard/Sales");
          history.replace("/Dashboard/Customer");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  async function submitData(data) {
    //console.log(data, outlets);

    try {
      console.log(data);
      //setError("");
      setLoading(true);
      createCustomer(data);
      setComplete(true);
    } catch {
      //setError("Duplicate User Email - Enter A New Email!");
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Customer Created Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {(!isSubmitSuccessful || !complete) && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Customer Create Form</h1>
          <div>
            <div className="mb-2">
              <label htmlFor="Customer_Name" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Customer Name
              </label>
              <input
                id="Customer_Name"
                name="Customer_Name"
                type="text"
                autoComplete="Customer_Name"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="Customer_Contact" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Customer Contact
              </label>
              <input
                id="Customer_Contact"
                name="Customer_Contact"
                type="number"
                autoComplete="Customer_Contact"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="flex mt-0">
              <div className="flex-1">
                <div className="mb-2">
                  <label htmlFor="Customer_Email" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Customer Email
                  </label>
                  <input
                    id="Customer_Email"
                    name="Customer_Email"
                    type="Email"
                    autoComplete="Customer_Email"
                    required
                    ref={register}
                    className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="Customer_Address" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Customer Address
              </label>
              <input
                id="Customer_Address"
                name="Customer_Address"
                type="text"
                autoComplete="Customer_Address"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="Customer_Postcode" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Customer Postcode
              </label>
              <input
                id="Customer_Postcode"
                name="Customer_Postcode"
                type="number"
                autoComplete="Customer_Postcode"
                required
                ref={register({ pattern: /^[0-9]{5}$/ })}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="flex align-middle mt-5">
              <button
                type="submit"
                className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Create Customer
              </button>
              <button
                type="reset"
                className="group relative ml-auto lg:ml-2 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-black hover:text-white font-bold border-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
