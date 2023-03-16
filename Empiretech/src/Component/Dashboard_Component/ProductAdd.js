import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addProduct, getOutlet } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";

export default function ProductAdd() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm();
  const history = useHistory();
  const [outlets, setOutlets] = useState([]);
  const [get, setGet] = useState(true);

  const onSubmit = (data) => submitGogo(data);

  useEffect(() => {
    if (outlets.length === 0) {
      getOutlet().then((value) => {
        setOutlets(value);
      });
    }
    return () => {
      setGet(false);
    };
  });

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && complete) {
        if (countdown === 0) {
          history.replace("/Dashboard/StockAvailability");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  async function submitGogo(data) {
    try {
      setLoading(true);
      //console.log(data, outlets);
      await addProduct(data, outlets);
      //history.push("/Dashboard/product");
      setError("");
      setComplete(true);
    } catch {
      setError("Duplicate Product Code - Enter A New Product Code!");
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && error === "" && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Product Added Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {(!isSubmitSuccessful || !complete) && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Add Product Form</h1>
          {error && <p className="text-red-600 text-lg font-bold">{error}</p>}
          <div>
            <div className="mb-2">
              <label htmlFor="ProductCode" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Product Code
              </label>
              <input
                id="productCode"
                name="productCode"
                type="text"
                autoComplete="productCode"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="productName" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Product Name
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                autoComplete="productName"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductPrice" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Price
              </label>
              <input
                id="productPrice"
                name="productPrice"
                type="number"
                autoComplete="productPrice"
                step="0.01"
                required
                min={0}
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductPrice" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Cost
              </label>
              <input
                id="productCost"
                name="productCost"
                type="number"
                autoComplete="productCost"
                step="0.01"
                required
                min={0}
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductCategory" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Category
              </label>
              <input
                id="ProductCategory"
                name="ProductCategory"
                type="text"
                autoComplete="ProductCategory"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-5">
              <div className="flex mt-0">
                <div className="flex-1 pr-5">
                  <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Outlet
                  </label>
                  <select
                    id="Outlet_Name"
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name="Outlet_Name"
                    type="text"
                    autoComplete="Outlet_Name"
                    required
                    readOnly
                    ref={register}
                  >
                    {!get ? (
                      outlets.map((outlet, idx) => (
                        <option value={outlet.Outlet_Name} key={outlet.Outlet_ID}>
                          {outlet.Outlet_ID} - {outlet.Outlet_Name}
                        </option>
                      ))
                    ) : (
                      <option value="Error">Error</option>
                    )}
                  </select>
                </div>
                <div className="flex-1 pl-5">
                  <label htmlFor="productQty" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Quantity
                  </label>
                  <input
                    id="productQty"
                    name="productQty"
                    type="number"
                    autoComplete="productQty"
                    required
                    readOnly
                    min={0}
                    defaultValue={0}
                    ref={register}
                    className="appearance-none md:mt-2 rounded-md relative bg-gray-200 block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                </div>
              </div>
            </div>
            <div className="flex align-middle">
              <button
                type="submit"
                className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Add Product
              </button>
              <button
                type="reset"
                className="group relative ml-auto lg:ml-2 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-black hover:text-white font-bold border-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Reset Form
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
