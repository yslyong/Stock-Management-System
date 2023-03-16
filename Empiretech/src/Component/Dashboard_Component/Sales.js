import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import Moment from "moment";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectInfiniteHits, connectSearchBox, Configure } from "react-instantsearch-dom";
import { createSales, getCustomer, getPaymentMethod } from "../../Context/DbContext";

var productData = [];

export default function Sales() {
  const searchClient = algoliasearch("566VNX4TJP", "b97a07d24773f99e345b6b9917a53c49");

  const SearchBox = ({ currentRefinement, refine }) => (
    <>
      {!error2 ? (
        <input
          type="search"
          placeholder="Search Product"
          className="appearance-none rounded-md px-3 py-2 lg:w-3/12 w-full border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          value={currentRefinement}
          onChange={(event) => refine(event.currentTarget.value)}
          onClick={() => setSearch(true)}
        />
      ) : (
        <>
          <input
            type="search"
            placeholder="Search Product"
            className="appearance-none rounded-md px-3 py-2 lg:w-3/12 w-full border  border-red-600 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            value={currentRefinement}
            onChange={(event) => refine(event.currentTarget.value)}
            onClick={() => setSearch(true)}
          />
          <div className="absolute mt-12 text-red-600">No Product Selected</div>
        </>
      )}
      <button
        type="button"
        className="ml-2 group relative flex justify-center lg:py-2 p-3 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setSearch(false)}
      >
        Cancel
      </button>
    </>
  );

  const Hits = ({ hits }) => (
    <>
      <div className="float-left w-9/12 lg:w-1/5 absolute rounded-md lg:mt-12 mt-14 z-50 bg-white  border-gray-700 border boder-3">
        {hits.map((hit, idx) => (
          <button
            key={idx}
            type="button"
            hidden={hit.Product_Qty[UserInfo.Outlet_Name] <= 0}
            className="w-full"
            onClick={() => clickCode(hit)}
          >
            <div className="lg:hover:bg-gray-200 p-3 flex flex-row">
              <div className="flex">{hit.Product_ID} - </div>
              <div className="flex flex-1 flex-grow ml-1">{hit.Product_Name}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const CustomHits = connectInfiniteHits(Hits);
  const CustomSearchBox = connectSearchBox(SearchBox);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => submitData(data, productData);
  const onSubmit2 = (data) => reprintInv(data);
  const history = useHistory();
  const [state, setstate] = useState(false);
  const [state2, setstate2] = useState(false);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bigTotal, setBigTotal] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [paymenthod, setPaymenthod] = useState();
  const [customer, setCustomer] = useState();

  const UserInfo = JSON.parse(localStorage.getItem("user"));

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("error");

  const clickCode = async (props) => {
    setSearch(false);
    var found = false;
    var length = productData.length;

    if (length === 0) {
      productData.push(props);
      productData[length]["Total"] = parseFloat(props.Product_Price);
      productData[length]["Purchased"] = 1;
      setError2(false);
      setstate2(true);
      await 200;
      cal();
    }

    for (var i = 0; i < productData.length; i++) {
      if (productData[i].Product_Name === props.Product_Name) {
        found = true;
        break;
      }
    }

    if (!found) {
      productData.push(props);
      productData[length]["Purchased"] = 1;
      productData[length]["Total"] = parseFloat(props.Product_Price);
      setError2(false);
      setstate2(true);
    }
    await 200;
    cal();
  };

  const getMax = (props) => {
    return props;
  };

  const getQty = async (props, price, idx) => {
    if (idx === undefined) {
      idx = 1;
      props = 1;
    }

    if (props < 1 && props !== "") {
      productData.splice(idx, 1);
      return setstate2(true);
    }

    productData[idx]["Purchased"] = parseInt(props);
    productData[idx]["Total"] = parseFloat(props * price);
    setstate2(true);
    cal();
    return props;
  };

  function valuePress(e) {
    e.preventDefault();
    cal();
    return true;
  }

  async function submitData(data, productData) {
    cal();
    if (balance < 0) {
      return setError(true);
    }

    if (productData.length <= 0) {
      return setError2(true);
    }

    try {
      //setError("");
      setError(false);
      setError2(false);
      setLoading(true);
      createSales(data, UserInfo, productData);
      //console.log(data, outlets);
      //await updateProduct(data);
      //history.push("/Dashboard/product");
      setComplete(true);
    } catch {
      //setError("Duplicate Product Code");
    }

    setLoading(false);
  }

  function reprintInv(data) {
    console.log(data);
    history.push("/Dashboard/SalesSingle?invoiceNo=" + data.Sales_ID);
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && !error && !error2 && complete) {
        if (countdown === 0) {
          const win = window.open("/Dashboard/SalesSingle?invoiceNo=0", "_blank");
          win.focus();
          history.go(0);
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (paymenthod === undefined) {
      getPaymentMethod().then((value) => {
        setPaymenthod(value);
      });
    }
    if (customer === undefined) {
      getCustomer().then((value) => {
        setCustomer(value);
      });
    }
    return () => {};
  });

  useEffect(() => {
    if (state) {
      const total = getValues("Total");
      const value = getValues("Value");
      setValue("Received", value);
      var received = getValues("Received");
      var count = received - total;
      setBalance(count);
    }
    return setstate(false);
  }, [state, getValues, setValue, setBalance]);

  useEffect(() => {
    if (state2) {
      var subTotal = 0;
      productData.map((product, idx) => (subTotal = product.Total + subTotal));
      setBigTotal(subTotal);
    }
    return setstate2(false);
  }, [state2]);

  function cal() {
    setstate(true);
  }

  const newCustomer = (props) => {
    if (props.target.value === "-1") {
      history.push("/Dashboard/Customer");
    }
  };

  return (
    <div>
      {isSubmitSuccessful && !error && !error2 && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Sales Created Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}

      {(!isSubmitSuccessful || !complete) && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Point of Sales</h1>
          <form onSubmit={handleSubmit(onSubmit2)}>
            <div className="flex lg:flex-row  flex-col items-baseline">
              <label htmlFor="Transfer_ID" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Reprint Invoice :
              </label>
              <div className="flex w-full lg:w-auto lg:ml-3">
                {query === null ? (
                  <input
                    id="Sales_ID"
                    name="Sales_ID"
                    type="number"
                    autoComplete="Sales_ID"
                    ref={register}
                    required
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                ) : (
                  <>
                    <input
                      id="Sales_ID"
                      name="Sales_ID"
                      type="number"
                      autoComplete="Sales_ID"
                      ref={register}
                      required
                      className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-red-600 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    ></input>
                    <div className="absolute mt-12 text-red-600">Invoice Not Found</div>
                  </>
                )}
                <button
                  type="submit"
                  className="group relative ml-5 lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex lg:flex-row flex-col">
              <h1 className="font-semibold text-lg text-gray-800">Outlet : {UserInfo.Outlet_Name}</h1>
              <h1 className="lg:ml-5 font-semibold text-lg text-gray-800">Sales Person : {UserInfo.Staff_Nickname}</h1>
              <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
                Date : {Moment(Date.now()).format("DD/MM/yyyy hh:mm A")}
              </h1>
            </div>
            <div className="flex lg:flex-row flex-col mb-5">
              <div className="flex flex-1 flex-col ring-1 ring-gray-400 ring-opacity-20 shadow-lg p-5 mb-6">
                <h1 className="font-semibold text-xl lg:text-2xl text-gray-800 lg:mx-0 underline mx-auto mb-3">
                  Customer Info
                </h1>
                <label htmlFor="Customer" className="flex mr-3 font-semibold text-lg text-gray-800">
                  Customer :
                </label>
                <select
                  id="Customer"
                  className="md:mt-2 mb-3 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="Customer"
                  type="number"
                  autoComplete="Customer"
                  required
                  ref={register}
                  onClick={(e) => newCustomer(e)}
                >
                  <option value="0">Select the Customer</option>
                  {customer !== undefined &&
                    customer.map((cust, idx) => (
                      <option value={cust.Customer_ID} key={cust.Customer_ID}>
                        {cust.Customer_ID} - {cust.Customer_Name}
                      </option>
                    ))}
                  <option value="-1">Create new Customer</option>;
                </select>
                <div className="flex lg:flex-row flex-col items-baseline">
                  <label htmlFor="CustomerDetails" className="flex-grow-0 mr-3 font-semibold text-lg text-gray-800">
                    Customer Address :
                  </label>
                </div>
                <textarea
                  id="CustomerDetails"
                  name="CustomerDetails"
                  type="text"
                  autoComplete="CustomerDetails"
                  ref={register}
                  className="appearance-none md:mt-2 min-h-3 rounded-md px-3 py-2 h-6 w-full lg:w-auto lg:flex-grow border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                ></textarea>
              </div>
              <div className="flex flex-1 flex-col ring-1 ring-gray-400 ring-opacity-20 shadow-lg p-5 mb-6 lg:mx-7">
                <h1 className="font-semibold text-xl lg:text-2xl text-gray-800 lg:mx-0 underline mx-auto mb-3">
                  Payment
                </h1>
                <label htmlFor="CustomerDetails" className="flex-grow-0 mr-3 font-semibold text-lg text-gray-800">
                  Payment Method :
                </label>
                <select
                  id="Payment_Method"
                  className="md:mt-2 mb-3 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  name="Payment_Method"
                  type="text"
                  autoComplete="Payment_Method"
                  required
                  ref={register}
                >
                  {paymenthod !== undefined &&
                    paymenthod.map((method, idx) => (
                      <option value={method.PayMethod_Name} key={method.PayMethod_Name}>
                        {method.PayMethod_ID} - {method.PayMethod_Name}
                      </option>
                    ))}
                </select>
                <label htmlFor="CustomerDetails" className="flex-grow-0 mr-3 font-semibold text-lg text-gray-800">
                  Value :
                </label>
                <input
                  id="Value"
                  name="Value"
                  type="number"
                  autoComplete="Value"
                  defaultValue={0}
                  onKeyPress={(e) => {
                    e.key === "Enter" && valuePress(e);
                  }}
                  step="0.01"
                  ref={register}
                  className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full lg:w-auto border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                ></input>
                <button
                  type="button"
                  onClick={() => {
                    const singleValue = getValues("Value");
                    if (singleValue > 0) {
                      setValue("Received", singleValue);
                      cal();
                    }
                  }}
                  className="group relative ml-auto mt-3 lg:mt-auto justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Calculate
                </button>
              </div>
              <div className="flex flex-1 flex-col ring-1 ring-gray-400 ring-opacity-20 shadow-lg p-5 mb-6">
                <h1 className="font-semibold text-xl lg:text-2xl text-gray-800 lg:mx-0 underline mx-auto mb-3">
                  Summary
                </h1>
                <div className="mb-3 flex flex-col items-baseline">
                  <label
                    htmlFor="CustomerDetails"
                    className="flex-grow-0 mr-3 w-2/8 font-semibold text-lg text-gray-800"
                  >
                    Total :
                  </label>
                  <input
                    id="Total"
                    name="Total"
                    type="number"
                    autoComplete="Total"
                    step="0.01"
                    value={bigTotal}
                    readOnly
                    ref={register}
                    className="appearance-none md:mt-2 w-full rounded-md px-3 py-2 flex-grow border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                </div>
                <div className="mb-0 flex flex-col items-baseline">
                  <label
                    htmlFor="CustomerDetails"
                    className="flex-grow-0 mr-3 w-2/8 font-semibold text-lg text-gray-800"
                  >
                    Received :
                  </label>
                  {!error ? (
                    <input
                      id="Received"
                      name="Received"
                      type="number"
                      autoComplete="Received"
                      step="0.01"
                      defaultValue={0}
                      readOnly
                      hidden={error}
                      disabled={error}
                      ref={register}
                      className="appearance-none md:mt-2 w-full rounded-md px-3 py-2 flex-grow border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    ></input>
                  ) : (
                    <input
                      id="Received"
                      name="Received"
                      type="number"
                      autoComplete="Received"
                      step="0.01"
                      defaultValue={0}
                      readOnly
                      hidden={!error}
                      disabled={!error}
                      ref={register}
                      className="appearance-none md:mt-2 w-full rounded-md px-3 py-2 flex-grow border bg-gray-200  border-red-600 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    ></input>
                  )}
                </div>
                {error && (
                  <div className="flex mt-0 ml-auto w-max">
                    <h1 className="text-red-600">Payment Received less than total</h1>
                  </div>
                )}
                <div className="mt-auto">
                  <p className="mt-3 font-semibold text-3xl text-gray-800">
                    Balance : <span className="flex text-3xl">RM {balance}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex text-lg mb-10">
              <InstantSearch indexName="Product" searchClient={searchClient} refresh={true} stalledSearchDelay={500}>
                <CustomSearchBox defaultRefinement={""} />
                {search && <CustomHits />}
                <Configure query="" hitsPerPage={20} distinct />
              </InstantSearch>
              <button
                type="submit"
                disabled={loading}
                onClick={() => {
                  cal();
                }}
                className="group relative lg:flex hidden ml-auto justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Confirm Transection
              </button>
            </div>
            <div className="flex">
              <table className="border-collapse w-full mt-5">
                <thead className="text-center hidden lg:table-header-group border-2">
                  <tr>
                    <th className="p-3 w-auto font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
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
                    <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                      U.Price
                    </th>
                    <th className="p-3 lg:w-2/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product, idx) => (
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
                      <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 lg:text-left text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Product
                        </span>
                        {product.Product_Name}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Qty
                        </span>
                        <input
                          className="appearance-none md:mt-2 rounded-md px-3 py-2 w-2/3 flex-grow border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          defaultValue={1}
                          name="qty"
                          type="number"
                          min={-1}
                          max={getMax(product.Product_Qty[UserInfo.Outlet_Name])}
                          onChange={(e) => getQty(e.target.value, product.Product_Price, idx)}
                        />
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Unit Price
                        </span>
                        {product.Product_Price}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Price
                        </span>
                        {product.Total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                cal();
              }}
              className="group relative lg:hidden flex justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm Transection
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
