import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import Moment from "moment";
import { getPurchasesByID } from "../../Context/DbContext";
import { useReactToPrint } from "react-to-print";
import PurchasesPrint from "../Print_Component/PurchasesPrint";

export default function PurchasesSingle() {
  const history = useHistory();
  const [purchase, setPurchases] = useState();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("purchasesID");

  if (!query) {
    history.push("/Dashboard/Purchases");
  }

  useEffect(() => {
    if (purchase === undefined) {
      getPurchasesByID(query).then((value) => {
        setPurchases(value);
      });
    }
    return () => {};
  }, [purchase, query]);

  return (
    <div className="mt-8 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
      <h1 className="lg:text-4xl text-2xl text-center font-bold mb-4">Purchases Details</h1>
      {purchase !== undefined ? (
        <>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Purchases ID : {purchase.Purchases_ID}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">Outlet: {purchase.To_Outlet}</h1>
          </div>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Created By : {purchase.Staff_Nickname}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
              Date Created: {Moment(purchase.Purchases_Date.toDate()).format("DD/MM/yyyy hh:mm A")}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg lg:mr-2 text-gray-800">Supplied By : </h1>
            <h1 className="font-semibold text-lg text-gray-800">{purchase.Supplier.Supplier_Name}</h1>
          </div>
          <div className="flex">
            <table className="border-collapse w-full mt-5">
              <thead className="text-center hidden lg:table-header-group border-2">
                <tr>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    No
                  </th>
                  <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Code
                  </th>
                  <th className="p-3 lg:w-5/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Product Name
                  </th>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Qty
                  </th>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Cost
                  </th>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchase.Product &&
                  purchase.Product.map((prod, idx) => (
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
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Code
                        </span>
                        {prod.Product_ID}
                      </td>
                      <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Product Name
                        </span>
                        {prod.Product_Name}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Qty
                        </span>
                        {prod.Purchased}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Unit Price
                        </span>
                        {prod.Product_Cost}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Total
                        </span>
                        {prod.Total}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-row ml-auto items-baseline mb-3 lg:mt-3">
            <label htmlFor="Ref" className="flex lg:ml-auto mr-3 font-semibold text-lg text-gray-800">
              Total :
            </label>
            <h1 className="font-semibold text-lg text-gray-800">RM{purchase.Total}</h1>
          </div>
          <button
            className="group relative mr-3 lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handlePrint}
          >
            Print
          </button>
          <Link to={"/Dashboard/PurchasesDetails?purchasesMonth=" + purchase.Purchases_Month}>
            <button
              type="submit"
              className="group relative mr-auto lg:ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
          </Link>
          <div className="hidden">
            <PurchasesPrint purchase={purchase} ref={componentRef} />
          </div>
        </>
      ) : (
        purchase === undefined && (
          <>
            <h1 className="lg:text-2xl mt-5 text-lg text-center font-bold">No Record Found</h1>
            <Link to="/Dashboard/Purchases">
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

/*
          <ReactToPdf targetRef={componentRef} filename="div-blue.pdf" x={0.5} y={0.5} scale={0.8}>
            {({ toPdf }) => <button onClick={toPdf}>Generate pdf</button>}
          </ReactToPdf>
          <PurchasesPrint purchase={purchase} ref={componentRef} /> */
