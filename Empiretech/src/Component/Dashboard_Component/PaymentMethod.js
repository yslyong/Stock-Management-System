import React, { useEffect, useState } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { getPaymentMethod } from "../../Context/DbContext";

export default function PaymentMethod() {
  const history = useHistory();
  const [paymentmethod, setPaymentmethod] = useState();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (paymentmethod === undefined) {
        getPaymentMethod().then((value) => {
          setPaymentmethod(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [paymentmethod]);

  const clickCode = (props) => {
    history.push("/Dashboard/PaymentMethodUpdate?payMethod_ID=" + props);
  };
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/Dashboard/Config/" && (
        <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Customer Details</h1>
      )}
      <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 w-full">
        <div className="flex items-end">
          <Link to="/Dashboard/PaymentMethodCreate" className="mr-auto">
            <button
              type="submit"
              className="group relative mr-auto  lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              New Payment Method
            </button>
          </Link>
        </div>
        <div>
          <table className="border-collapse w-full">
            <thead className="text-center hidden lg:table-header-group border-2">
              <tr>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  No
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Payment Method ID
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Payment Method Name
                </th>
              </tr>
            </thead>
            {paymentmethod !== undefined && paymentmethod.length > 0 ? (
              <tbody>
                {paymentmethod.map((method, idx) => (
                  <tr
                    key={idx}
                    className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0"
                  >
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        No
                      </span>
                      {parseInt(idx) + 1}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-6 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Payment Method ID
                      </span>
                      <span
                        className="no-underline hover:underline cursor-pointer text-blue-800"
                        onClick={() => {
                          clickCode(method.PayMethod_ID);
                        }}
                      >
                        Payment Method ID {method.PayMethod_ID}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-6 lg:pt-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Payment Method Name
                      </span>
                      {method.PayMethod_Name}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              paymentmethod === undefined && (
                <tbody>
                  <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                    <td
                      className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static"
                      colSpan="7"
                    >
                      Loading Result
                    </td>
                  </tr>
                </tbody>
              )
            )}
            {paymentmethod !== undefined && paymentmethod.length === 0 && (
              <tbody>
                <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                  <td
                    className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static"
                    colSpan="7"
                  >
                    No Result Found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
