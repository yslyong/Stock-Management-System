import { useRef, useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, connectHits, connectSearchBox, Configure, connectStats } from "react-instantsearch-dom";
import { useHistory } from "react-router-dom";
import ProductRow from "./ProductRow";
import { connectMenu } from "react-instantsearch-dom";
import { useReactToPrint } from "react-to-print";
import { getProduct, getOutlet } from "../../Context/DbContext";

import React from "react";
import StockPrint from "../Print_Component/StockPrint";
const searchClient = algoliasearch("566VNX4TJP", "b97a07d24773f99e345b6b9917a53c49");

export default function StockAvailability() {
  const history = useHistory();
  const [product, setProduct] = useState();
  const [outlet, setOutlet] = useState();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  var editInfo = true;

  const userInfo = JSON.parse(localStorage.getItem("user"));

  if (userInfo.Role_Name === "Owner") {
    editInfo = false;
  }
  if (userInfo.Role_Name === "Admin") {
    editInfo = false;
  }
  if (userInfo.Role_Name === "Sales") {
    editInfo = true;
  }
  if (userInfo.Role_Name === "Logistic") {
    editInfo = true;
  }

  useEffect(() => {
    if (product === undefined) {
      getProduct().then((value) => {
        setProduct(value);
      });
    }
    if (outlet === undefined) {
      getOutlet().then((value) => {
        setOutlet(value);
      });
    }
    return () => {};
  }, [product, outlet]);

  const SearchBox = ({ currentRefinement, refine }) => (
    <div className="flex flex-1 lg:flex-row flex-col items-baseline w-full">
      <h1 className="mr-3 font-bold text-lg">Search : </h1>
      <input
        type="search"
        className="mr-2 appearance-none md:mt-2 rounded-md relative mb-3 block lg:w-2/6 w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
      />
      <CustomMenuSelect attribute="Product_Category" />
      <CustomStats />
    </div>
  );

  const Hits = ({ hits, hasMore, refineNext, refinePrevious }) => (
    <>
      {hits.map((hit, idx) => (
        <ProductRow productObj={hit} key={idx} index={idx} />
      ))}
      {hasMore && (
        <tr>
          <td className="pt-1 lg:pt-3" colSpan="2">
            <button
              className="block py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={refineNext}
              disabled={hasMore}
            >
              Show more
            </button>
          </td>
        </tr>
      )}
    </>
  );

  const Stats = ({ nbHits }) => {
    return <p className="lg:ml-3 lg:mr-30 lg:mt-0 mt-3 w-auto">Total Result {nbHits}</p>;
    // return the DOM output
  };

  const MenuSelect = ({ items, currentRefinement, refine }) => (
    <select
      id="Category"
      className="md:mt-2 rounded-md relative block lg:w-2/6 w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      name="Category"
      type="text"
      onChange={(event) => refine(event.currentTarget.value)}
    >
      <option value="">Select Category</option>
      {items.map((item) => (
        <option key={item.label} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );

  // 2. Connect the component using the connector
  const CustomMenuSelect = connectMenu(MenuSelect);

  // 3. Use your connected widget
  const CustomStats = connectStats(Stats);
  const CustomHits = connectHits(Hits);
  const CustomSearchBox = connectSearchBox(SearchBox);

  return (
    <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20">
      <h1 className="lg:text-4xl text-2xl text-center font-bold lg:mb-10 mb-5">Stock Availability</h1>
      <InstantSearch indexName="Product" searchClient={searchClient}>
        <div className="flex lg:flex-row flex-col">
          <CustomSearchBox focusShortcuts={["s"]} />
          <div className="flex-initial place-items-end items-baseline">
            <button
              className="flex mt-3  mr-3 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
          {!editInfo && (
            <div className="flex-initial place-items-end items-baseline">
              <button
                onClick={() => history.push("/Dashboard/ProductAdd")}
                className="flex mt-3 py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Product
              </button>
            </div>
          )}
        </div>
        <table className="border-collapse w-full mt-5">
          <thead className="text-center hidden lg:table-header-group border-2 border-gray-300">
            <tr>
              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
                No
              </th>
              <th className="p-0 border border-gray-300">
                <table className="text-center w-full p-0">
                  <thead>
                    <tr className="w-full p-0 border-b border-gray-300">
                      <th
                        colSpan="2"
                        className="p-3 w-full font-bold uppercase bg-gray-200 text-gray-600 border-gray-300 hidden lg:table-cell"
                      >
                        Code
                      </th>
                    </tr>
                    <tr className="w-full">
                      <th className="p-3 font -bold uppercase bg-gray-200 text-gray-600 border-r border-gray-300 hidden lg:table-cell lg:w-1/2">
                        Price
                      </th>
                      <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border-gray-300 hidden lg:table-cell lg:w-1/2">
                        Cost
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th className="p-0 border border-gray-300 lg:w-9/12">
                <table className="text-center w-full p-0">
                  <thead>
                    <tr className="w-full p-0 border-b border-gray-300">
                      <th className="p-3 w-full font-bold uppercase bg-gray-200 text-gray-600 border-gray-300 hidden lg:table-cell">
                        Product Name
                      </th>
                    </tr>
                    <tr className="w-full">
                      <th className="p-3 w-full font-bold uppercase bg-gray-200 text-gray-600 border-gray-300 hidden lg:table-cell">
                        Outlet
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
            </tr>
          </thead>
          <tbody>
            <Configure query="" hitsPerPage={5} /> <CustomHits />
          </tbody>
        </table>
      </InstantSearch>
      <div className="hidden">
        {product !== undefined && outlet !== undefined && (
          <StockPrint product={product} outlet={outlet} ref={componentRef} />
        )}
      </div>
    </div>
  );
}
