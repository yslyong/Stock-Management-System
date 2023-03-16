import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getTransferByOutletNonReceived } from "../../Context/DbContext";
import Moment from "moment";

export default function StockTransfer() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => submitData(data);
  const history = useHistory();
  const [count, setCount] = useState(0);
  const [transfer, setTransfer] = useState();

  const UserInfo = JSON.parse(localStorage.getItem("user"));

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("error");

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (transfer === undefined && count < 1) {
        getTransferByOutletNonReceived(UserInfo.Outlet_Name).then((value) => {
          setTransfer(value);
        });
      }
    }, 2000);
    return () => {
      setCount(count + 1);
      clearInterval(interval);
    };
  }, [UserInfo.Outlet_Name, transfer, count]);

  const clickCode = (props) => {
    history.push("/Dashboard/ReceiveTransfer?transferID=" + props);
  };

  function submitData(data) {
    history.push("/Dashboard/ReceiveTransfer?transferID=" + data.Transfer_ID);
  }

  return (
    <div>
      <h1 className="font-bold text-xl mb-3">Ongoing stock transfer for {UserInfo.Outlet_Name}</h1>
      <div className="flex flex-col mb-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex lg:flex-row  flex-col items-baseline">
            <label htmlFor="Transfer_ID" className="px-1 py-4 font-semibold text-lg text-gray-800">
              Stock Transfer No :
            </label>
            <div className="flex w-full lg:w-auto lg:ml-3">
              {query === null ? (
                <input
                  id="Transfer_ID"
                  name="Transfer_ID"
                  type="number"
                  autoComplete="Transfer_ID"
                  ref={register}
                  required
                  className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                ></input>
              ) : (
                <>
                  <input
                    id="Transfer_ID"
                    name="Transfer_ID"
                    type="number"
                    autoComplete="Transfer_ID"
                    ref={register}
                    required
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-red-600 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                  <div className="absolute mt-12 text-red-600">Wrong Stock Transfer Code</div>
                </>
              )}
              <button
                type="submit"
                className="group relative ml-5 lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>

            <div className="flex lg:ml-auto lg:mt-0 mt-5">
              <Link to="/Dashboard/TransferCreate">
                <button
                  type="submit"
                  className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Stock Transfer
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div>
        <table className="border-collapse w-full">
          <thead className="text-center hidden lg:table-header-group border-2">
            <tr>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                No
              </th>
              <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Transfer No
              </th>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                From
              </th>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                To
              </th>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Received
              </th>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Transfer Date
              </th>
              <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                Receive Date
              </th>
            </tr>
          </thead>

          {transfer !== undefined && transfer.length > 0 ? (
            <tbody>
              {transfer.map((trans, idx) => (
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
                      Transfer No
                    </span>
                    <span
                      className="no-underline hover:underline cursor-pointer text-blue-800"
                      onClick={() => {
                        clickCode(trans.Transfer_ID);
                      }}
                    >
                      {`Transfer No ` + trans.Transfer_ID}
                    </span>
                  </td>
                  <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                      Transfer From
                    </span>
                    {trans.Transfer_From}
                  </td>
                  <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                      Transfer To
                    </span>
                    {trans.Transfer_To}
                  </td>
                  <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                      Status
                    </span>
                    {trans.Transfer_Received ? "Received" : "Transfering"}
                  </td>
                  <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                      Transfer Date
                    </span>
                    <p> {Moment(trans.Transfer_Date.toDate()).format("DD/MM/yyyy")}</p>
                    <p> {Moment(trans.Transfer_Date.toDate()).format("hh:mm A")}</p>
                  </td>
                  <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                    <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                      Receive Date
                    </span>
                    {
                      <>
                        <p>
                          {trans.Transfer_ReceivedDate !== "" &&
                            Moment(trans.Transfer_ReceivedDate.seconds * 1000).format("DD/MM/yyyy")}
                        </p>
                        <p>
                          {trans.Transfer_ReceivedDate !== "" &&
                            Moment(trans.Transfer_ReceivedDate * 1000).format("hh:mm A")}
                        </p>
                      </>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                <td
                  className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static"
                  colSpan="7"
                >
                  No ongoing stock transfer to be received
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
