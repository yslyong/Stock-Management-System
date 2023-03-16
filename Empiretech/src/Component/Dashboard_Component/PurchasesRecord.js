import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { getPurchasesTotal } from "../../Context/DbContext";

export default function PurchasesRecord() {
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [purchases, setPurchases] = useState();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (purchases === undefined && count < 1) {
        getPurchasesTotal().then((value) => {
          setPurchases(value);
        });
      }
    }, 2000);
    return () => {
      setCount(count + 1);
      clearInterval(interval);
    };
  }, [purchases, count]);

  const clickCode = (props) => {
    history.push("/Dashboard/PurchasesDetails?purchasesMonth=" + props);
  };

  return (
    <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
      <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Purchases</h1>
      <div className="flex flex-col">
        <div className="flex lg:ml-auto lg:mt-0 mt-0">
          <Link to="/Dashboard/PurchasesCreate">
            <button
              type="submit"
              className="group relative mr-auto lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Purchases
            </button>
          </Link>
        </div>
      </div>
      <div>
        <table className="border-collapse w-full">
          <thead className="text-center hidden lg:table-header-group border-2">
            <tr>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                No
              </th>
              <th className="p-3 lg:w-1/2 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Month
              </th>
              <th className="p-3 lg:w-1/2 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Total
              </th>
            </tr>
          </thead>
          {purchases !== undefined ? (
            <tbody>
              {Object.entries(purchases.Total)
                .sort()
                .map((exp, idx) => (
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
                        Month
                      </span>
                      <span
                        className="no-underline hover:underline cursor-pointer text-blue-800"
                        onClick={() => {
                          clickCode(exp[0]);
                        }}
                      >
                        {exp[0]}
                      </span>
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Total
                      </span>
                      {exp[1]}
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
                    colSpan="7"
                  >
                    Loading Result
                  </td>
                </tr>
              </tbody>
            )
          )}
        </table>
      </div>
    </div>
  );
}
