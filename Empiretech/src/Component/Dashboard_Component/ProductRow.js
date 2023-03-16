import React from "react";
import { useHistory } from "react-router-dom";

export default function ProductRow(product, key, index) {
  const productObj = product.productObj;
  const history = useHistory();
  const clickCode = (props) => {
    history.push("/Dashboard/ProductUpdate?product=" + props);
  };

  return (
    <tr className="lg:odd:bg-white bg-white lg:even:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 border-gray-300 lg:flex-no-wrap mb-10 lg:mb-0">
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">No</span>
        {product.index + 1}
      </td>
      <td className="w-full lg:w-auto p-0 text-gray-800 text-center sm:border-r sm:border-l border-gray-300 sm:border-b block lg:table-cell relative lg:static">
        <table className="w-full">
          <tbody>
            <tr className="w-full">
              <td className="w-full lg:w-full p-3 text-gray-800 text-center block border-b border-gray-300 lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Code
                </span>
                <span
                  className="no-underline hover:underline cursor-pointer text-blue-800"
                  onClick={() => {
                    clickCode(productObj.Product_ID);
                  }}
                >
                  {productObj.Product_ID}
                </span>
              </td>
            </tr>
            <tr className="w-full">
              <td className="w-full lg:w-full p-0 text-gray-800 text-center block lg:table-cell border-gray-300 relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Qty
                </span>
                <table className="text-center w-full">
                  <tbody>
                    <tr className="text-center w-full">
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border-gray-300 lg:border-r block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Price
                        </span>
                        RM {(Math.round(productObj.Product_Price * 100) / 100).toFixed(2)}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border-t border-gray-300 lg:border-none block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Cost
                        </span>
                        RM {(Math.round(productObj.Product_Cost * 100) / 100).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td className="w-full lg:w-auto p-0 text-gray-800 text-center block sm:border-l border-gray-300 lg:text-left sm:border-r border-b lg:table-cell relative lg:static">
        <table className="w-full">
          <tbody>
            <tr className="w-full">
              <td className="w-full lg:w-full text-center p-3 pt-5 text-gray-800 lg:border-t-0 border-t border-gray-300 block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Product Name
                </span>
                {productObj.Product_Name}
              </td>
            </tr>
            <tr className="w-full ">
              <td className="w-full lg:w-full text-gray-800 block border-t lg:table-cell border-gray-300 relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Qty
                </span>
                <table className="w-full">
                  <tbody>
                    <tr className="w-full grid lg:flex text-center">
                      {Object.entries(productObj.Product_Qty)
                        .sort()
                        .map((key, index) => (
                          <td
                            className="lg:flex-row lg:flex-1 p-1 lg:p-3 lg:border-r border-gray-300 last:border-r-0"
                            key={key.toString()}
                          >
                            {key[0]} : {key[1]}
                          </td>
                        ))}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
