import React, { useEffect, useState } from "react";
import { getSalesIndex } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";

export default function SalesRecord() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const [sales, setSales] = useState();
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (sales === undefined) {
        getSalesIndex().then((value) => {
          setSales(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [sales, setSales, userInfo.Outlet_Name]);

  function salesClick(props) {
    history.push("/Dashboard/SalesDetails?salesMonth=" + props);
  }

  return (
    <>
      <div>
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
          <div className="flex flex-col">
            <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Sales Record</h1>
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
              {sales !== undefined ? (
                <tbody>
                  {Object.entries(sales.Total)
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
                              salesClick(exp[0]);
                            }}
                          >
                            {exp[0]}
                          </span>
                        </td>
                        <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                          <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                            Total
                          </span>
                          {exp[1].Total}
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
      </div>
    </>
  );
}
