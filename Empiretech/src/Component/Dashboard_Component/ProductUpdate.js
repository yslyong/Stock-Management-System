import React, { useState, useEffect } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getProductByID, updateProduct, getProductMovementByProduct } from "../../Context/DbContext";
import Moment from "moment";

export default function ProductUpdate() {
  const history = useHistory();
  const [product, setProduct] = useState();
  const [productMove, setProductMove] = useState();
  const [countdown, setCountdown] = useState(3);
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm();
  const onSubmit = (data) => submitData(data);

  var editInfo = true;
  var editQty = true;
  const userInfo = JSON.parse(localStorage.getItem("user"));

  if (userInfo.Role_Name === "Owner") {
    editInfo = false;
    editQty = false;
  }
  if (userInfo.Role_Name === "Admin") {
    editInfo = false;
    editQty = true;
  }
  if (userInfo.Role_Name === "Sales") {
    editInfo = true;
    editQty = true;
  }
  if (userInfo.Role_Name === "Logistic") {
    editInfo = true;
    editQty = true;
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful || error) {
        if (countdown === 0) {
          if (!error) return history.push("/Dashboard/ProductUpdate?product=" + product[0].Product_ID);
          return history.push("/Dashboard/StockAvailability");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery().get("product");

  if (!query) {
    history.push("/Dashboard/StockAvailability");
  }

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (productMove === undefined && count2 < 1) {
        getProductMovementByProduct(query).then((value) => {
          setProductMove(value);
        });
      }
    }, 1000);
    return () => {
      setCount2(count2 + 1);
      clearInterval(interval);
    };
  }, [query, productMove, count2]);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (product === undefined && count < 1) {
        getProductByID(query).then((value) => {
          setProduct(value);
        });
      }
    }, 1000);
    return () => {
      setCount(count + 1);
      clearInterval(interval);
    };
  }, [query, product, count]);

  async function submitData(data) {
    try {
      //setError("");
      setLoading(true);
      //console.log(data, outlets);
      await updateProduct(data);
      //history.push("/Dashboard/product");
    } catch {
      //setError("Duplicate Product Code");
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Product Updated Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {product !== undefined && product.length > 0 && !isSubmitSuccessful ? (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
            <h1 className="lg:text-4xl text-2xl text-center font-bold">Product Details</h1>
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
                  defaultValue={product[0].Product_ID}
                  readOnly={true}
                  ref={register}
                  className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                  defaultValue={product[0].Product_Name}
                  readOnly={editInfo}
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
                  step="0.50"
                  required
                  min={0}
                  defaultValue={product[0].Product_Price}
                  readOnly={editInfo}
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
                  step="0.50"
                  required
                  min={0}
                  defaultValue={product[0].Product_Cost}
                  readOnly={editInfo}
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
                  defaultValue={product[0].Product_Category}
                  readOnly={editInfo}
                  className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                ></input>
              </div>
              <div className="mb-5">
                <div className="flex mt-0">
                  <div className="flex-1 lg:pr-5">
                    <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                      Outlet
                    </label>
                  </div>
                  <div className="flex-1 lg:pl-5">
                    <label htmlFor="productQty" className="px-1 py-4 font-semibold text-lg text-gray-800">
                      Quantity
                    </label>
                  </div>
                </div>
                {product !== undefined &&
                  Object.entries(product[0].Product_Qty)
                    .sort()
                    .map((key, index) => (
                      <div className="flex mt-0 mb-2" key={key.toString()}>
                        <div className="flex-1 pr-1 lg:pr-5">
                          <input
                            id="Outlet"
                            name={`productQty[${index}].[0]`}
                            type="text"
                            autoComplete="Outlet"
                            required
                            ref={register}
                            defaultValue={key[0]}
                            readOnly={true}
                            className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          ></input>
                        </div>
                        <div className="flex-1 pl-1 kg:pl-5">
                          <input
                            id="productQty"
                            name={`productQty[${index}].[1]`}
                            type="number"
                            autoComplete="productQty"
                            required
                            ref={register}
                            defaultValue={key[1]}
                            readOnly={editQty}
                            className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          ></input>
                        </div>
                      </div>
                    ))}
              </div>
              {!editInfo && (
                <div className="flex align-middle">
                  <button
                    type="submit"
                    className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    readOnly={loading}
                  >
                    Update Product
                  </button>
                  <button
                    type="reset"
                    className="group relative lg:ml-2 ml-auto justify-center py-2 px-4 border border-transparent text-lg rounded-md text-black hover:text-white font-bold border-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    readOnly={loading}
                  >
                    Reset Form
                  </button>
                </div>
              )}
            </div>
          </form>
          {productMove !== undefined && productMove.length > 0 ? (
            <>
              <h1 className="lg:text-4xl text-2xl text-center font-bold">Product Movement</h1>
              <table className="border-collapse w-full mt-5">
                <thead className="text-center hidden lg:table-header-group border-2 border-gray-300">
                  <tr>
                    <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      No
                    </th>
                    <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Status
                    </th>
                    <th className="p-3 w-3/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Movement Time
                    </th>
                    <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                      Reference
                    </th>
                    {product !== undefined &&
                      Object.entries(product[0].Product_Qty)
                        .sort()
                        .map((key, index) => (
                          <th
                            key={index}
                            className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                          >
                            {key[0]}
                          </th>
                        ))}
                  </tr>
                </thead>
                <tbody key={1}>
                  {productMove.map((prod, idx) => (
                    <tr
                      key={idx}
                      className="lg:odd:bg-white bg-white lg:even:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 border-gray-300 lg:flex-no-wrap mb-3 lg:mb-0"
                    >
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          No
                        </span>
                        {idx + 1}
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Status
                        </span>
                        {prod.ProductStatus_Type}
                      </td>
                      <td className="w-full lg:w-auto p-3 pt-5 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Movement Time
                        </span>
                        <p>{Moment(prod.ProductStatus_Date.toDate()).format("DD/MM/yyyy hh:mm A")}</p>
                      </td>
                      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static">
                        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                          Reference
                        </span>
                        {prod.ProductStatus_Type === "Purchases" && (
                          <Link to={`/Dashboard/PurchasesSingle?purchasesID=${prod.ProductStatus_Ref}`}>
                            <p className="no-underline hover:underline cursor-pointer text-blue-800">
                              Purchases No {prod.ProductStatus_Ref}
                            </p>
                          </Link>
                        )}
                        {(prod.ProductStatus_Type === "Transfer" || prod.ProductStatus_Type === "Receive") && (
                          <Link to={`/Dashboard/ReceiveTransfer?transferID=${prod.ProductStatus_Ref}`}>
                            <p className="no-underline hover:underline cursor-pointer text-blue-800">
                              Transfer No {prod.ProductStatus_Ref}
                            </p>
                          </Link>
                        )}
                        {prod.ProductStatus_Type === "Sales" && (
                          <Link to={`/Dashboard/Invoice?invoiceNo=${prod.ProductStatus_Ref}`}>
                            <p className="no-underline hover:underline cursor-pointer text-blue-800">
                              Invoice No {prod.ProductStatus_Ref}
                            </p>
                          </Link>
                        )}
                      </td>
                      {product !== undefined &&
                        Object.entries(product[0].Product_Qty)
                          .sort()
                          .map((key, index) => (
                            <>
                              {prod.ProductStatus_Type === "Purchases" && (
                                <td
                                  key={index}
                                  className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static"
                                >
                                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                    {key[0]}
                                  </span>
                                  {prod.ProductStatus_Receiver === key[0] ? <>{prod.Product_QTY}</> : <>0</>}
                                </td>
                              )}
                              {prod.ProductStatus_Type === "Transfer" && (
                                <td
                                  key={index}
                                  className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static"
                                >
                                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                    {key[0]}
                                  </span>
                                  {prod.ProductStatus_Sender === key[0] ? <>{`(${prod.Product_QTY})`}</> : <>0</>}
                                </td>
                              )}
                              {prod.ProductStatus_Type === "Receive" && (
                                <td
                                  key={index}
                                  className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static"
                                >
                                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                    {key[0]}
                                  </span>
                                  {prod.ProductStatus_Receiver === key[0] ? <>{prod.Product_QTY}</> : <>0</>}
                                </td>
                              )}
                              {prod.ProductStatus_Type === "Sales" && (
                                <td
                                  key={index}
                                  className="w-full lg:w-auto p-3 text-gray-800 text-center border border-gray-300 block lg:table-cell relative lg:static"
                                >
                                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                    {key[0]}
                                  </span>
                                  {prod.ProductStatus_Sender === key[0] ? <>{`(${prod.Product_QTY})`}</> : <>0</>}
                                </td>
                              )}
                            </>
                          ))}
                    </tr>
                  ))}
                  <tr className="bg-white lg:hover:bg-gray-100 lg:table-row hidden lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                    <td
                      className="w-full lg:w-auto p-3 text-gray-800 text-right block border lg:table-cell relative lg:static"
                      colSpan="4"
                    >
                      Total :
                    </td>
                    {product !== undefined &&
                      Object.entries(product[0].Product_Qty)
                        .sort()
                        .map((key, index) => (
                          <>
                            <td
                              key={index}
                              className="w-full lg:w-auto p-3 text-gray-800 text-center border-r border-gray-300 block lg:table-cell relative lg:static"
                            >
                              {key[1] > 0 ? <>{key[1]}</> : 0}
                            </td>
                          </>
                        ))}
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col lg:hidden mt-0 mb-2">
                <h1 className="text-2xl text-center font-bold">Total</h1>
                {product !== undefined &&
                  Object.entries(product[0].Product_Qty)
                    .sort()
                    .map((key, index) => (
                      <div className="flex mb-3" key={index}>
                        <div className="flex-1 pr-1 lg:pr-5">
                          <input
                            id="Outlet"
                            name={`productQty[${index}].[0]`}
                            type="text"
                            autoComplete="Outlet"
                            required
                            ref={register}
                            defaultValue={key[0]}
                            readOnly
                            className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          ></input>
                        </div>
                        <div className="flex-1 pl-1 kg:pl-5">
                          <input
                            id="productQty"
                            name={`productQty[${index}].[1]`}
                            type="number"
                            autoComplete="productQty"
                            required
                            ref={register}
                            defaultValue={key[1]}
                            readOnly
                            className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          ></input>
                        </div>
                      </div>
                    ))}
              </div>
            </>
          ) : (
            productMove === undefined && (
              <h1 className="lg:text-4xl text-2xl text-center font-bold">Loading Product Movement</h1>
            )
          )}

          {productMove !== undefined && productMove.length === 0 && (
            <table className="border-collapse w-full mt-5">
              <thead className="text-center hidden lg:table-header-group border-2 border-gray-300">
                <tr>
                  <th className="p-3 w-1/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    No
                  </th>
                  <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Status
                  </th>
                  <th className="p-3 w-3/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Movement Time
                  </th>
                  <th className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                    Reference
                  </th>
                  {product !== undefined &&
                    Object.entries(product[0].Product_Qty)
                      .sort()
                      .map((key, index) => (
                        <th
                          key={index}
                          className="p-3 w-2/12 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell"
                        >
                          {key[0]}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap border-2 lg:flex-no-wrap mb-10 lg:mb-0">
                  <td
                    className="w-full lg:w-auto p-3 text-gray-800 text-center border block lg:table-cell relative lg:static"
                    colSpan="7"
                  >
                    Product Movement Not Found
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      ) : (
        product === undefined && (
          <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50">
            <h1 className="lg:text-4xl text-2xl text-center font-bold">Loading Product</h1>
          </div>
        )
      )}

      {product !== undefined && product.length === 0 && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Product Not Found</h1>
          {history.push("/Dashboard/StockAvailability")}
        </div>
      )}
    </div>
  );
}
