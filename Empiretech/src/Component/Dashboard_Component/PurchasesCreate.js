import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectInfiniteHits, connectSearchBox, Configure } from "react-instantsearch-dom";
import { getSupplier, createPurchases } from "../../Context/DbContext";
import Moment from "moment";

var productData = [];

export default function TransferCreate() {
  const searchClient = algoliasearch("566VNX4TJP", "b97a07d24773f99e345b6b9917a53c49");
  const userInfo = JSON.parse(localStorage.getItem("user"));

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
          <button key={idx} type="button" className="w-full" onClick={() => clickCode(hit)}>
            <div className="lg:hover:bg-gray-200 p-3 flex lg:flex-row flex-col">
              <div className="flex">{hit.Product_ID} - </div>
              <div className="flex flex-1 flex-grow lg:ml-1 text-left">{hit.Product_Name}</div>
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
    setValue,
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
  const [suppliers, setSuppliers] = useState();

  const clickCode = async (props) => {
    setSearch(false);
    var found = false;
    var length = productData.length;

    if (length === 0) {
      productData.push(props);
      productData[length]["Total"] = parseFloat(props.Product_Cost);
      productData[length]["Purchased"] = 1;
      setstate(true);
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
      productData[length]["Total"] = parseFloat(props.Product_Cost);
      productData[length]["Purchased"] = 1;
      setstate(true);
      setError(false);
    }
  };

  useEffect(() => {
    if (suppliers === undefined) {
      getSupplier().then((value) => {
        setSuppliers(value);
      });
    }

    return () => {};
  });

  function reject(e) {
    setstate(true);
    return e.preventDefault();
  }

  const getQty = async (props, price, idx) => {
    if (idx === undefined) {
      idx = 1;
      props = 1;
    }

    if (props < 1 && props !== "") {
      productData.splice(idx, 1);
      return setstate(true);
    }

    productData[idx]["Purchased"] = parseInt(props);
    productData[idx]["Total"] = parseFloat(props * price);
    setstate(true);
    return props;
  };

  const newSupplier = (props) => {
    if (props.target.value === "999") {
      history.push("/Dashboard/SupplierCreate?Purchases=1");
    }
  };

  async function submitData(data, userInfo, productData) {
    setstate(true);
    if (productData.length <= 0) {
      return setError(true);
    }

    try {
      //setError("");
      setError(false);
      setLoading(true);
      createPurchases(data, userInfo, productData);
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
          history.push("/Dashboard/Purchases");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (state) {
      var subTotal = 0;
      productData.map((product, idx) => (subTotal = product.Total + subTotal));
      setValue("SubTotal", subTotal);
    }
    return setstate(false);
  }, [state, setValue]);

  return (
    <div>
      {isSubmitSuccessful && !error && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Purchases Create Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}

      {(!isSubmitSuccessful || !complete) && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Create Purchases Form</h1>
          <div className="flex lg:flex-row flex-col">
            <h1 className="font-semibold text-lg text-gray-800">Outlet : {userInfo.Outlet_Name}</h1>
            <h1 className="lg:ml-5 font-semibold text-lg text-gray-800">Current User : {userInfo.Staff_Nickname}</h1>
            <h1 className="lg:ml-auto font-semibold text-lg text-gray-800">
              Date : {Moment(Date.now()).format("DD/MM/yyyy hh:mm A")}
            </h1>
          </div>
          <div className="flex lg:flex-row flex-col items-baseline">
            <label htmlFor="Customer" className="flex mr-3 font-semibold text-lg text-gray-800">
              Supplier :
            </label>
            <select
              id="Supplier"
              className="md:mt-2 lg:w-auto w-full rounded-md relative flex px-3 py-2 border lg:mb-3 mb-2 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              name="Supplier"
              type="number"
              min={1}
              autoComplete="Supplier"
              required
              ref={register}
              onChange={(e) => newSupplier(e)}
            >
              <option value="">Select the Supplier</option>
              {suppliers !== undefined &&
                suppliers.map((supplier, idx) => (
                  <option value={supplier.Supplier_ID} key={supplier.Supplier_Name}>
                    {supplier.Supplier_ID} - {supplier.Supplier_Name}
                  </option>
                ))}
              <option value="999">999 - Add new Supplier</option>;
            </select>
            <div className="flex lg:flex-row flex-col items-baseline lg:ml-auto lg:w-auto w-full">
              <label htmlFor="Ref" className="flex mr-3 font-semibold text-lg text-gray-800">
                Reference No :
              </label>
              <input
                id="Ref"
                name="Ref"
                type="text"
                autoComplete="Ref"
                required
                onKeyPress={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                ref={register}
                className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full lg:w-auto border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
          </div>
          <div className="flex text-lg lg:pt-0 pt-6 mb-10">
            <InstantSearch indexName="Product" searchClient={searchClient} refresh={true} stalledSearchDelay={500}>
              <CustomSearchBox defaultRefinement={""} />
              {search && <CustomHits />}
              <Configure query="" hitsPerPage={3} distinct />
            </InstantSearch>
            <button
              type="submit"
              disabled={loading}
              onClick={() => {}}
              className="group relative lg:flex hidden ml-auto justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Confirm Purchases
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
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Cost
                  </th>
                  <th className="p-3 lg:w-1/12 font-bold uppercase bg-gray-200 border text-gray-600 border-gray-300 hidden lg:table-cell">
                    Total
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
                        onChange={(e) => getQty(e.target.value, product.Product_Cost, idx)}
                        onKeyPress={(e) => {
                          e.key === "Enter" && reject(e);
                        }}
                      />
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Cost
                      </span>
                      {product.Product_Cost}
                    </td>
                    <td className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static">
                      <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                        Cost
                      </span>
                      {product.Total}
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
            <input
              id="SubTotal"
              name="SubTotal"
              type="number"
              autoComplete="SubTotal"
              defaultValue={0}
              readOnly
              ref={register}
              className="appearance-none md:mt-2 rounded-md px-3 py-2 w-full lg:w-auto border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            onClick={() => {}}
            className="group relative lg:hidden flex justify-center py-2 px-4 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Confirm Purchases
          </button>
        </form>
      )}
    </div>
  );
}
