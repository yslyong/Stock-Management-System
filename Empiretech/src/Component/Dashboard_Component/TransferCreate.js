import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectInfiniteHits, connectSearchBox, Configure } from "react-instantsearch-dom";
import { getOutlet, createTransfer } from "../../Context/DbContext";

var productData = [];
const userInfo = JSON.parse(localStorage.getItem("user"));

export default function TransferCreate() {
  const searchClient = algoliasearch("566VNX4TJP", "b97a07d24773f99e345b6b9917a53c49");
  const UserInfo = JSON.parse(localStorage.getItem("user"));

  const SearchBox = ({ currentRefinement, refine }) => (
    <>
      {!error ? (
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
    formState: { isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => submitData(data, userInfo, productData);
  const history = useHistory();
  const [state, setstate] = useState(false);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [outlets, setOutlets] = useState([]);

  const clickCode = async (props) => {
    setSearch(false);
    var found = false;
    var length = productData.length;

    if (length === 0) {
      productData.push(props);
      productData[length]["Transfered"] = 1;
      setError(false);
    }

    for (var i = 0; i < productData.length; i++) {
      if (productData[i].Product_Name === props.Product_Name) {
        found = true;
        break;
      }
    }

    if (!found) {
      productData.push(props);
      productData[length]["Transfered"] = 1;
      setError(false);
    }
  };

  useEffect(() => {
    if (outlets.length === 0) {
      getOutlet().then((value) => {
        setOutlets(value);
      });
    }

    return () => {};
  });

  useEffect(() => {
    if (state) {
    }
    return setstate(false);
  }, [state]);

  function reject(e) {
    if (e.target.max > e.target.value) return e.preventDefault();

    return null;
  }

  const getMax = (props) => {
    return props;
  };

  const getQty = async (props, idx) => {
    if (idx === undefined) {
      idx = 1;
      props = 1;
    }

    if (props < 1 && props !== "") {
      productData.splice(idx, 1);
      return setstate(true);
    }

    productData[idx]["Transfered"] = parseInt(props);
    return props;
  };

  async function submitData(data, UserInfo, productData) {
    if (productData.length <= 0) {
      return setError(true);
    }

    try {
      //setError("");
      setError(false);
      setLoading(true);
      createTransfer(data, UserInfo, productData);
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
          history.go(0);
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div>
      {isSubmitSuccessful && !error && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Stock Transfer Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}

      {(!isSubmitSuccessful || !complete) && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Stock Transfer Form</h1>

          <div className="flex lg:flex-row flex-col mt-0">
            <div className="flex-1 pl-0 lg:pl-0 lg:pr-5">
              <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                From Outlet
              </label>
              <select
                id="Outlet_From"
                className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                name="Outlet_From"
                type="text"
                autoComplete="Outlet_From"
                required
                ref={register}
              >
                {outlets.map((outlet, idx) => {
                  if (userInfo.Outlet_Name === outlet.Outlet_Name) {
                    return (
                      <option value={outlet.Outlet_Name} key={outlet.Outlet_ID}>
                        {outlet.Outlet_ID} - {outlet.Outlet_Name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
            <div className="flex flex-col px-5 mx-auto justify-center">
              <h1 className="lg:flex hidden font-bold text-xl">&nbsp;</h1>
              <h1 className="flex py-2 lg:py-0 font-bold text-xl">TO</h1>
            </div>
            <div className="flex-1 pl-0 lg:pl-5">
              <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                To Outlet
              </label>
              <select
                id="Outlet_To"
                className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                name="Outlet_To"
                type="text"
                autoComplete="Outlet_To"
                required
                ref={register}
              >
                {outlets.map((outlet, idx) => {
                  if (userInfo.Outlet_Name !== outlet.Outlet_Name) {
                    return (
                      <option value={outlet.Outlet_Name} key={outlet.Outlet_ID}>
                        {outlet.Outlet_ID} - {outlet.Outlet_Name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          </div>
          <div className="flex text-lg lg:pt-0 pt-6 mb-10">
            <InstantSearch indexName="Product" searchClient={searchClient} refresh={true} stalledSearchDelay={500}>
              <CustomSearchBox defaultRefinement={""} />
              {search && <CustomHits />}
              <Configure query="" hitsPerPage={20} distinct />
            </InstantSearch>
            <button
              type="submit"
              disabled={loading}
              onClick={() => {}}
              className="group relative lg:flex hidden ml-auto justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm Trasnsfer
            </button>
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
                        onChange={(e) => getQty(e.target.value, idx)}
                        onKeyPress={(e) => {
                          e.key === "Enter" && reject(e);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="submit"
            disabled={loading}
            onClick={() => {}}
            className="group relative lg:hidden flex justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Confirm Trasnsfer
          </button>
        </form>
      )}
    </div>
  );
}
