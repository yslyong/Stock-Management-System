import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { getSalesByMonth } from "../../Context/DbContext";
import Moment from "moment";

export default function SalesDetails() {
  const history = useHistory();
  const [sales, setSales] = useState();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("salesMonth");

  if (!query) {
    history.push("/Dashboard/SalesRecord");
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (sales === undefined) {
        getSalesByMonth(query).then((value) => {
          setSales(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [sales, query]);

  const clickCode = (props) => {
    history.push("/Dashboard/SalesSingle?invoiceNo=" + props);
  };

  return (
    <>
      <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
        <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Sales Details for {query}</h1>
        <div>
          <table className="border-collapse w-full">
            <thead className="text-center hidden lg:table-header-group border-2">
              <tr>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  No
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Invoice No
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Bill To
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Created By
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Outlet
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Sales Date
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Total
                </th>
              </tr>
            </thead>
            {sales !== undefined && sales.length > 0 ? (
              <tbody>
                {sales.map((sale, idx) => (
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
                        Invoice No
                      </span>
                      <span
                        className="no-underline hover:underline cursor-pointer text-blue-800"
                        onClick={() => {
                          clickCode(sale.Sales_ID);
                        }}
                      >
                        Invoice No {sale.Sales_ID}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Bill To
                      </span>
                      {sale.Customer.Customer_Name}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Created By
                      </span>
                      {sale.Staff_Nickname}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Outlet
                      </span>
                      {sale.Outlet_Name}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Sales Date
                      </span>
                      <p> {Moment(sale.Sales_Date.toDate()).format("DD/MM/yyyy")}</p>
                      <p> {Moment(sale.Sales_Date.toDate()).format("hh:mm A")}</p>
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Total
                      </span>
                      {sale.Total}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              sales === undefined && (
                <tbody>
                  <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                    <td
                      className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static"
                      colSpan="8"
                    >
                      Loading Result
                    </td>
                  </tr>
                </tbody>
              )
            )}
            {sales !== undefined && sales.length === 0 && (
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
          <Link to={"/Dashboard/SalesRecord"}>
            <button
              type="submit"
              className="group relative mt-5 lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
