import React from "react";
import Moment from "moment";
import LetterHead from "./LetterHead";

export default class ExpensesPrint extends React.Component {
  render() {
    const expenses = this.props.expenses;

    return (
      <div className="p-5">
        <title>Transfer Report {expenses.Expenses_ID}</title>
        <table className="report-container w-full">
          <thead className="report-header">
            <tr>
              <th className="report-header-cell">
                <div className="header-info">
                  <LetterHead />
                  <h1 className="text-2xl text-right font-bold">Expenses Details</h1>
                  <table>
                    <tbody>
                      <td className="w-10/12">
                        <div className="flex flex-1 flex-col pr-10"></div>
                      </td>
                      <td className="w-2/12 text-left">
                        <div className="flex flex-1 flex-col">
                          <h1 className="font-normal text-base text-gray-800 leading-6">Expenses ID</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">Reference No</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">Date Created</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">Created By</h1>
                        </div>
                      </td>
                      <td className="w-auto text-center px-3">
                        <div className="flex flex-1 flex-col">
                          <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                          <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                        </div>
                      </td>
                      <td className="text-left">
                        <h1 className="font-normal text-base text-gray-800 leading-6">{expenses.Expenses_ID}</h1>
                        <h1 className="font-normal text-base text-gray-800 leading-6">{expenses.Expenses_Ref}</h1>
                        <h1 className="font-normal text-base text-gray-800 leading-6">
                          {Moment(expenses.Created_Date.toDate()).format("DD/MM/yyyy")}
                        </h1>
                        <h1 className="font-normal text-base text-gray-800 leading-6">{expenses.Created_By}</h1>
                      </td>
                    </tbody>
                  </table>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="report-content">
            <tr>
              <td className="report-content-cell">
                <div className="main">
                  {expenses !== undefined && (
                    <>
                      <div className="w-full mt-1">
                        <div className="flex">
                          <table className="border-collapse w-full mt-2">
                            <thead className="text-center table-header-group border-2">
                              <tr>
                                <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  No
                                </th>
                                <th className="p-3 w-auto font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Description
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Qty
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Unit Price
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {expenses.Expenses_Desc &&
                                expenses.Expenses_Desc.map((desc, idx) => (
                                  <tr
                                    key={idx}
                                    className="bg-white lg:hover:bg-gray-100  table-row flex-row border-2 flex-no-wrap mb-10 lg:mb-0"
                                  >
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {idx + 1}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-left border table-cell static">
                                      {desc.Description}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {desc.Qty}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {desc.UnitPrice}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {desc.Total}
                                    </td>
                                  </tr>
                                ))}
                              <tr className="bg-white lg:hover:bg-gray-100  table-row flex-row border-2 flex-no-wrap mb-10 lg:mb-0">
                                <td
                                  className="lg:w-auto p-3 text-gray-800 text-right border table-cell static"
                                  colSpan={4}
                                >
                                  <h1 className="font-semibold text-lg text-gray-800">Total :</h1>
                                </td>
                                <td
                                  className="lg:w-auto p-3 text-gray-800 text-center border table-cell static"
                                  colSpan={5}
                                >
                                  <h1 className="font-semibold text-lg text-gray-800">RM{expenses.Expenses_Total}</h1>{" "}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
