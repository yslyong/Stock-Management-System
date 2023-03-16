import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { getCustomer } from "../../Context/DbContext";

export default function Supplier() {
  const history = useHistory();
  const [Customer, setCustomer] = useState();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (Customer === undefined) {
        getCustomer().then((value) => {
          setCustomer(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [Customer]);

  const clickCode = (props) => {
    history.push("/Dashboard/CustomerUpdate?customerID=" + props);
  };

  const location = useLocation();

  return (
    <>
      <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 w-full">
        {location.pathname !== "/Dashboard/Config/" && (
          <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Customer Details</h1>
        )}
        <Link to="/Dashboard/CustomerCreate">
          <button
            type="submit"
            className="group relative mr-auto lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Customer
          </button>
        </Link>
        <div>
          <table className="border-collapse w-full">
            <thead className="text-center hidden lg:table-header-group border-2">
              <tr>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  No
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  ID
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Name
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Contact
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Email
                </th>
                <th className="p-3 lg:w-5/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Address
                </th>
              </tr>
            </thead>
            {Customer !== undefined && Customer.length > 0 ? (
              <tbody>
                {Customer.map((sup, idx) => (
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
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        ID
                      </span>
                      <span
                        className="no-underline hover:underline cursor-pointer text-blue-800"
                        onClick={() => {
                          clickCode(sup.Customer_ID);
                        }}
                      >
                        Customer ID {sup.Customer_ID}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-6 lg:pt-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Name
                      </span>
                      {sup.Customer_Name}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Contact
                      </span>
                      {sup.Customer_Contact}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Email
                      </span>
                      {sup.Customer_Email}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-6 lg:pt-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Address
                      </span>
                      <span className="pt-10 lg:pt-0">{sup.Customer_Address}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              Customer === undefined && (
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
            {Customer !== undefined && Customer.length === 0 && (
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
