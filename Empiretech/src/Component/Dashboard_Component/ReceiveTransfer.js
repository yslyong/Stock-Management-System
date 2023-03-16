import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Moment from "moment";
import { getTransferByID, receiveTransfer } from "../../Context/DbContext";
import { useReactToPrint } from "react-to-print";
import StockTransferPrint from "../Print_Component/StockTransferPrint";

export default function ReceiveTransfer() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => submitData(data, UserInfo);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [transfer, setTransfer] = useState([]);
  const [TransferDate, setTransferDate] = useState();
  const [ReceivedDate, setReceivedDate] = useState();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const UserInfo = JSON.parse(localStorage.getItem("user"));

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("transferID");

  if (!query) {
    history.push("/Dashboard/StockTransfer");
  }

  useEffect(() => {
    if (transfer.length === 0) {
      getTransferByID(query).then((value) => {
        setTransfer(value);
      });
    }

    if (Object.keys(transfer).length > 0 && TransferDate === undefined) {
      setTransferDate(transfer.Transfer_Date.toDate());

      if (transfer.Transfer_ReceivedDate !== "" && ReceivedDate === undefined) {
        setReceivedDate(transfer.Transfer_ReceivedDate.toDate());
      }
    }

    return () => {};
  }, [transfer, TransferDate, ReceivedDate, query]);

  async function submitData(data, UserInfo) {
    if (data.Transfer_To !== UserInfo.Outlet_Name) {
      return setError(true);
    }

    try {
      setError(false);
      setLoading(true);
      receiveTransfer(data, UserInfo);
      setComplete(true);
    } catch {
      //setError("Duplicate Product Code");
    }
    setLoading(false);
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && !error && complete) {
        if (countdown === 0) {
          history.push("/Dashboard/StockTransfer");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div>
      {!transfer && history.push("/Dashboard/StockTransfer?error=1")}

      {isSubmitSuccessful && !error && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Stock Transfer Received</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {(!isSubmitSuccessful || !complete) && transfer && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Receive Stock Transfer</h1>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Transferred ID : {transfer.Transfer_ID}</h1>
            <input
              id="Transfer_ID"
              name="Transfer_ID"
              type="text"
              autoComplete="Transfer_ID"
              hidden={true}
              readOnly={true}
              ref={register}
              defaultValue={transfer.Transfer_ID}
            ></input>
          </div>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Transferred By : {transfer.Transfer_By}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
              Date Transferred: {TransferDate && Moment(TransferDate).format("DD/MM/yyyy hh:mm A")}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col">
            <h1 className="lg:ml-5 font-semibold text-lg text-gray-800">
              Received By : {transfer.Transfer_ReceivedBy && transfer.Transfer_ReceivedBy}
            </h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
              Date Received: {ReceivedDate && Moment(ReceivedDate).format("DD/MM/yyyy hh:mm A")}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col mt-0">
            <div className="flex-1 pl-0 lg:pl-0 lg:pr-5">
              <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                From Outlet
              </label>
              <input
                id="Transfer_From"
                name="Transfer_From"
                type="text"
                autoComplete="Transfer_From"
                defaultValue={transfer.Transfer_From}
                readOnly={true}
                ref={register}
                className="md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="flex flex-col px-5 mx-auto justify-center">
              <h1 className="lg:flex hidden font-bold text-xl">&nbsp;</h1>
              <h1 className="flex py-2 lg:py-0 font-bold text-xl">TO</h1>
            </div>
            <div className="flex-1 pl-0 lg:pl-5">
              <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                To Outlet
              </label>
              {!error ? (
                <input
                  id="Transfer_To"
                  name="Transfer_To"
                  type="text"
                  autoComplete="Transfer_To"
                  defaultValue={transfer.Transfer_To}
                  readOnly={true}
                  ref={register}
                  className="md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                ></input>
              ) : (
                <>
                  <input
                    id="Outlet_To"
                    name="Outlet_To"
                    type="text"
                    autoComplete="Outlet_To"
                    defaultValue={transfer.Transfer_To}
                    readOnly={true}
                    ref={register}
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-red-600 bg-gray-200 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                  <div className="absolute text-red-600">Unable to receive stock for other outlets.</div>
                </>
              )}
            </div>
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
                </tr>
              </thead>
              <tbody>
                {transfer.Transfer_Product &&
                  transfer.Transfer_Product.map((product, idx) => (
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
                        {product.Product_ID}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 lg:text-left text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Product
                        </span>
                        {product.Product_Name}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Qty
                        </span>
                        {product.Transfered}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            {!transfer.Transfer_Received && (
              <button
                type="submit"
                disabled={loading}
                className="justify-center mr-3 mb-3 py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirm Receive
              </button>
            )}
            <span
              className="mr-3 justify-center cursor-pointer py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handlePrint}
            >
              Print
            </span>
            <Link to={"/Dashboard/StockTransfer"}>
              <span
                type="button"
                className="justify-center cursor-pointer py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back
              </span>
            </Link>
            <div className="hidden">
              <StockTransferPrint transfer={transfer} ref={componentRef} />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
