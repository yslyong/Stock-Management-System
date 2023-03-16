import React from "react";
import Moment from "moment";
import LetterHead from "./LetterHead";

export default class StockTransferPrint extends React.Component {
  render() {
    const transfer = this.props.transfer;
    var ReceivedDate;
    if (
      transfer.Transfer_ReceivedDate !== "" &&
      transfer.Transfer_ReceivedDate !== undefined &&
      ReceivedDate === undefined
    ) {
      ReceivedDate = transfer.Transfer_ReceivedDate.toDate();
    }

    return (
      <div className="p-5">
        <title>Transfer Report {transfer.Transfer_ID}</title>
        <table className="report-container w-full">
          <thead className="report-header">
            <tr>
              <th className="report-header-cell">
                <div className="header-info">
                  <LetterHead />
                  <h1 className="text-2xl text-right font-bold">Transfer Report</h1>
                  <table className="w-full">
                    <tbody>
                      <td className="w-2/3">
                        <tr>
                          <td className="w-auto">
                            <div className="flex flex-1 flex-col pr-10">
                              <h1 className="font-normal text-base text-gray-800 leading-6">Transfer From</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Transfer To</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Date Transferred</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Date Received</h1>
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
                          <td className="w-auto text-left">
                            <h1 className="font-normal text-base text-gray-800 leading-6">{transfer.Transfer_From}</h1>
                            <h1 className="font-normal text-base text-gray-800 leading-6">{transfer.Transfer_To}</h1>
                            <h1 className="font-normal text-base text-gray-800 leading-6">
                              {transfer.Transfer_Date !== undefined &&
                                Moment(transfer.Transfer_Date.toDate()).format("DD/MM/yyyy hh:mm A")}
                            </h1>
                            <h1 className="font-normal text-base text-gray-800 leading-6">
                              {transfer.Transfer_ReceivedDate !== undefined && ReceivedDate !== undefined ? (
                                Moment(ReceivedDate).format("DD/MM/yyyy hh:mm A")
                              ) : (
                                <span>&nbsp;</span>
                              )}
                            </h1>
                          </td>
                        </tr>
                      </td>
                      <td className="w-full">
                        <tr>
                          <td className="w-2/3 text-left">
                            <div className="flex flex-1 flex-col">
                              <h1 className="font-normal text-base text-gray-800 leading-6">&nbsp;</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Transfer ID</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Transferred By</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">Received By </h1>
                            </div>
                          </td>
                          <td className="text-center px-3">
                            <div className="flex flex-1 flex-col">
                              <h1 className="font-normal text-base text-gray-800 leading-6">&nbsp;</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                            </div>
                          </td>
                          <td className="w-full text-left">
                            <div className="flex flex-1 flex-col">
                              <h1 className="font-normal text-base text-gray-800 leading-6">
                                {transfer.Transfer_ReceivedDate !== undefined && ReceivedDate !== undefined && (
                                  <span>&nbsp;</span>
                                )}
                              </h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">{transfer.Transfer_ID}</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">{transfer.Transfer_By}</h1>
                              <h1 className="font-normal text-base text-gray-800 leading-6">
                                {transfer.Transfer_ReceivedBy && transfer.Transfer_ReceivedBy}
                              </h1>
                            </div>
                          </td>
                        </tr>
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
                  {transfer !== undefined && (
                    <>
                      <div className="w-full mt-1">
                        <div className="flex">
                          <table className="border-collapse w-full mt-2">
                            <thead className="text-center table-header-group border-2">
                              <tr>
                                <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  No
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Code
                                </th>
                                <th className="p-3 w-5/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Product Name
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Qty
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {transfer.Transfer_Product &&
                                transfer.Transfer_Product.map((product, idx) => (
                                  <tr
                                    key={idx}
                                    className="bg-white lg:hover:bg-gray-100  table-row flex-row border-2 flex-no-wrap mb-10 lg:mb-0"
                                  >
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {idx + 1}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {product.Product_ID}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-left border table-cell static">
                                      {product.Product_Name}
                                    </td>
                                    <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static">
                                      {product.Transfered}
                                    </td>
                                  </tr>
                                ))}
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
