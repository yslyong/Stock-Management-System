import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { getPurchasesByMonth } from "../../Context/DbContext";
import Moment from "moment";

export default function PurchasesDetails() {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [purchases, setPurchases] = useState();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("purchasesMonth");

  if (!query) {
    history.push("/Dashboard/Purchases");
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (purchases === undefined && count < 1) {
        getPurchasesByMonth(query).then((value) => {
          setPurchases(value);
        });
      }
    }, 2000);
    return () => {
      setCount(count + 1);
      clearInterval(interval);
    };
  }, [purchases, count, query]);

  const clickCode = (props) => {
    history.push("/Dashboard/PurchasesSingle?purchasesID=" + props);
  };

  return (
    <>
      <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
        <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Purchases Details for {query}</h1>
        <div>
          <table className="border-collapse w-full">
            <thead className="text-center hidden lg:table-header-group border-2">
              <tr>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  No
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Purchases No
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Reference No
                </th>
                <th className="p-3 lg:w-3/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Supplier
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Created By
                </th>
                <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  To Outlet
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Created Date
                </th>
                <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                  Total
                </th>
              </tr>
            </thead>
            {purchases !== undefined && purchases.length > 0 ? (
              <tbody>
                {purchases.map((purchase, idx) => (
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
                        Purchases No
                      </span>
                      <span
                        className="no-underline hover:underline cursor-pointer text-blue-800"
                        onClick={() => {
                          clickCode(purchase.Purchases_ID);
                        }}
                      >
                        Purchases No {purchase.Purchases_ID}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Reference No
                      </span>
                      {purchase.Purchases_Ref}
                    </td>
                    <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Supplier
                      </span>
                      {purchase.Supplier.Supplier_Name}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Created By
                      </span>
                      {purchase.Staff_Nickname}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        To Outlet
                      </span>
                      {purchase.To_Outlet}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Created Date
                      </span>
                      <p> {Moment(purchase.Purchases_Date.toDate()).format("DD/MM/yyyy")}</p>
                      <p> {Moment(purchase.Purchases_Date.toDate()).format("hh:mm A")}</p>
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Total
                      </span>
                      {purchase.Total}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              purchases === undefined && (
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
            {purchases !== undefined && purchases.length === 0 && (
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
          <Link to={"/Dashboard/Purchases"}>
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
