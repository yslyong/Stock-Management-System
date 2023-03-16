import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getSalesbyOutletLimit } from "../../Context/DbContext";
import Moment from "moment";

export default function DashboardSales() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => submitData(data);

  const history = useHistory();
  const [sales, setSales] = useState();
  const userInfo = JSON.parse(localStorage.getItem("user"));

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("error");

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (sales === undefined) {
        getSalesbyOutletLimit(userInfo.Outlet_Name).then((value) => {
          setSales(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [sales, setSales, userInfo.Outlet_Name]);

  const clickCode = (props) => {
    history.push("/Dashboard/SalesSingle?invoiceNo=" + props);
  };

  function submitData(data) {
    console.log(data);
    history.push("/Dashboard/SalesSingle?invoiceNo=" + data.Sales_ID);
  }

  return (
    <>
      <div>
        <h1 className="font-bold text-xl mb-3">Sales record for {userInfo.Outlet_Name}</h1>
        <div className="flex flex-col mb-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex lg:flex-row  flex-col items-baseline">
              <label htmlFor="Transfer_ID" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Reprint Invoice :
              </label>
              <div className="flex w-full lg:w-auto lg:ml-3">
                {query === null ? (
                  <input
                    id="Sales_ID"
                    name="Sales_ID"
                    type="number"
                    autoComplete="Sales_ID"
                    ref={register}
                    required
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                ) : (
                  <>
                    <input
                      id="Sales_ID"
                      name="Sales_ID"
                      type="number"
                      autoComplete="Sales_ID"
                      ref={register}
                      required
                      className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-red-600 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    ></input>
                    <div className="absolute mt-12 text-red-600">Wrong Stock Transfer Code</div>
                  </>
                )}
                <button
                  type="submit"
                  className="group relative ml-5 lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>

              <div className="flex lg:ml-auto lg:mt-0 mt-5">
                <Link to="/Dashboard/Sales">
                  <button
                    type="submit"
                    className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Sales
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div>
          <table className="border-collapse w-full">
            <thead className="text-center hidden lg:table-header-group border-2">
              <tr>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  No
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Inovice No
                </th>
                <th className="p-3 lg:w-3/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Created By
                </th>
                <th className="p-3 lg:w-3/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Bill TO
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Created Date
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
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
                        Created By
                      </span>
                      {sale.Staff_Nickname}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Customer Name
                      </span>
                      {sale.Customer.Customer_Name}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Sales Creation Date
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
        </div>
      </div>
    </>
  );
}
