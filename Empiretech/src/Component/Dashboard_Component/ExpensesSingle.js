import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import Moment from "moment";
import { getExpensesByID } from "../../Context/DbContext";
import { useReactToPrint } from "react-to-print";
import ExpensesPrint from "../Print_Component/ExpensesPrint";

export default function ExpensesSingle() {
  const history = useHistory();
  const [expenses, setExpenses] = useState();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("expensesID");

  if (!query) {
    history.push("/Dashboard/Expenses");
  }

  useEffect(() => {
    if (expenses === undefined) {
      getExpensesByID(query).then((value) => {
        setExpenses(value);
      });
    }
    return () => {};
  }, [expenses, query]);

  return (
    <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
      <h1 className="lg:text-4xl text-2xl text-center font-bold">Expenses Details</h1>
      {expenses !== undefined ? (
        <>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Expenses ID : {expenses.Expenses_ID}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">Reference No: {expenses.Expenses_Ref}</h1>
          </div>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Created By : {expenses.Created_By}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
              Date Created: {Moment(expenses.Created_Date.toDate()).format("DD/MM/yyyy hh:mm A")}
            </h1>
          </div>
          <div className="flex">
            <table className="border-collapse w-full mt-5">
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
                {expenses.Expenses_Desc &&
                  expenses.Expenses_Desc.map((desc, idx) => (
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
                      <td className="w-full lg:w-auto p-3 text-gray-800 lg:text-left text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Code
                        </span>
                        {desc.Description}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Qty
                        </span>
                        {desc.Qty}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Unit Price
                        </span>
                        {desc.UnitPrice}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Total
                        </span>
                        {desc.Total}
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
            <h1 className="font-semibold text-lg text-gray-800">RM{expenses.Expenses_Total}</h1>
          </div>
          <button
            className="group relative mr-3 lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handlePrint}
          >
            Print
          </button>
          <Link to={"/Dashboard/ExpensesDetails?expensesMonth=" + expenses.Created_Month}>
            <button
              type="submit"
              className="group relative mt-5 lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
          </Link>
          <div className="hidden">
            <ExpensesPrint expenses={expenses} ref={componentRef} />
          </div>
        </>
      ) : (
        expenses === undefined && (
          <>
            <h1 className="lg:text-2xl mt-5 text-lg text-center font-bold">No Record Found</h1>
            <Link to="/Dashboard/Expenses">
              <button
                type="submit"
                className="group relative mr-auto lg:mx-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </button>
            </Link>
          </>
        )
      )}
    </div>
  );
}
