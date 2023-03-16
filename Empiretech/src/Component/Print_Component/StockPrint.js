import React from "react";
import Moment from "moment";

export default class StockPrint extends React.Component {
  render() {
    const product = this.props.product;
    const outlet = this.props.outlet;
    var DateNow = Moment(Date.now()).format("DD-MM-yyyy-hh-mmA");

    return (
      <div className="p-5">
        <title>Stock Check Report {DateNow}</title>
        <table className="report-container w-full">
          <thead className="report-header">
            <tr>
              <th className="report-header-cell">
                <div className="header-info">
                  <h1 className="text-2xl text-center font-bold mb-3">Stock Check Report</h1>
                  <div className="flex flex-row">
                    <div className="flex flex-col">
                      <h1 className="font-normal text-base text-gray-800 leading-6">Generated On </h1>
                    </div>
                    <div className="flex flex-col px-2">
                      <h1 className="font-normal text-base text-gray-800 leading-6">:</h1>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="font-normal text-base text-gray-800 leading-6">
                        {Moment(Date.now()).format("DD-MM-yyyy hh:mm A")}
                      </h1>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="report-content">
            <tr>
              <td className="report-content-cell">
                <div className="main">
                  {product !== undefined && (
                    <>
                      <div className="w-full mt-1">
                        <div className="flex">
                          <table className="border-collapse w-full mt-2">
                            <thead className="text-center table-header-group border-2">
                              <tr>
                                <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  No
                                </th>
                                <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Code
                                </th>
                                <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                  Product Name
                                </th>
                                {outlet.map((outlet, idx) => (
                                  <>
                                    {Object.entries(product[0].Product_Qty)
                                      .sort()
                                      .map((key, index) => (
                                        <>
                                          {outlet.Outlet_Name === key[0] && (
                                            <>
                                              <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                                {key[0]}
                                              </th>
                                              <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 table-cell">
                                                Actuall Qty
                                              </th>
                                            </>
                                          )}
                                        </>
                                      ))}
                                  </>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {product &&
                                product.map((product, idx) => (
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
                                    {outlet.map((outlet, idx) => (
                                      <>
                                        {Object.entries(product.Product_Qty)
                                          .sort()
                                          .map((key, index) => (
                                            <>
                                              {outlet.Outlet_Name === key[0] && (
                                                <>
                                                  <td
                                                    key={index}
                                                    className="lg:w-auto p-3 text-gray-800 text-center border table-cell static"
                                                  >
                                                    {key[1]}
                                                  </td>
                                                  <td className="lg:w-auto p-3 text-gray-800 text-center border table-cell static"></td>
                                                </>
                                              )}
                                            </>
                                          ))}
                                      </>
                                    ))}
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
