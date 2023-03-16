import React, { useEffect, useState } from "react";
import { getSalesIndex, getExpensesTotal, getPurchasesTotal } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";
import Moment from "moment";

export default function DashboardSales() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const [sales, setSales] = useState();
  const [expenses, setExpenses] = useState();

  const [purchases, setPurchases] = useState();

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (expenses === undefined) {
        getExpensesTotal().then((value) => {
          setExpenses(value);
        });
      }
      if (purchases === undefined) {
        getPurchasesTotal().then((value) => {
          setPurchases(value);
        });
      }
      if (sales === undefined) {
        getSalesIndex().then((value) => {
          setSales(value);
        });
      }
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [sales, setSales, setExpenses, setPurchases, userInfo.Outlet_Name, expenses, purchases]);

  function expensesClick(props) {
    history.push("/Dashboard/ExpensesDetails?expensesMonth=" + props);
  }

  function purchasesClick(props) {
    history.push("/Dashboard/PurchasesDetails?purchasesMonth=" + props);
  }

  function salesClick(props) {
    history.push("/Dashboard/SalesDetails?salesMonth=" + props);
  }

  return (
    <>
      <div>
        <h1 className="font-bold text-xl mb-3 pl-3">Admin Record List</h1>
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-2 lg:grid-cols-2">
          <div className="flex-1 p-3 lg:border-r border-gray-200">
            <h1 className="font-bold text-xl mb-3">Purchases Record</h1>
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
                              purchasesClick(exp[0]);
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
          <div className="flex-1 p-3 2xl:border-r border-gray-200">
            <h1 className="font-bold text-xl mb-3">Sales Record</h1>
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
          <div className="flex-1 p-3 lg:border-r border-gray-200">
            <h1 className="font-bold text-xl mb-3">Expenses Record</h1>
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
              {expenses !== undefined ? (
                <tbody>
                  {Object.entries(expenses.Total)
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
                              expensesClick(exp[0]);
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
                expenses === undefined && (
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
          <div className="flex-1 p-3">
            <h1 className="font-bold text-xl mb-3">Profit or Loss</h1>
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
              {sales !== undefined && expenses !== undefined ? (
                <tbody>
                  {Object.entries(sales.Total)
                    .sort()
                    .map((sale, idx) =>
                      Object.entries(expenses.Total)
                        .sort()
                        .map((exp, idx) => (
                          <>
                            {sale[0] === exp[0] && (
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
                                  <span onClick={() => {}}>{sale[0]}</span>
                                </td>
                                <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                    Total
                                  </span>
                                  {sale[1].Total - exp[1]}
                                </td>
                              </tr>
                            )}
                          </>
                        ))
                    )}
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
