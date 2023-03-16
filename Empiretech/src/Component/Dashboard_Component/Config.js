import React, { useState } from "react";
import Supplier from "./Supplier";
import Customer from "./Customer";
import PaymentMethod from "./PaymentMethod";
import AdminUpdate from "./AdminUpdate";

export default function Config() {
  const [active, setActive] = useState("3");

  function setActiveElement(props) {
    if (active === props) return setActive("");
    if (active !== "") return setActive(props);
    setActive(props);
    console.log(props);
  }

  return (
    <div className="mt-8 space-y-4 py-8 px-0 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50">
      <h1 className="lg:text-4xl text-2xl text-center font-bold">
        {active === "0" && <>Supplier Details</>}
        {active === "1" && <>Customer Details</>}
        {active === "2" && <>Payment Method Details</>}
        {active === "3" && <>Account Update</>}
      </h1>
      <div className="lg:flex flex-row hidden ">
        <div className="flex flex-col lg:border-r w-48 lg:pr-5 lg:text-left text-center lg:py-5 lg:items-start items-center lg:border-gray-200 align-bottom">
          <span
            className={` w-full cursor-pointer mb-5 hover:text-white text-black p-3 hover:bg-blue-600 rounded-lg ${
              active === "0" ? "bg-blue-600 text-white" : "bg-transparent"
            }`}
            onClick={() => setActiveElement("0")}
          >
            Supplier
          </span>
          <span
            className={` w-full cursor-pointer mb-5 hover:text-white text-black p-3 hover:bg-blue-600 rounded-lg ${
              active === "1" ? "bg-blue-600 text-white" : "bg-transparent"
            }`}
            onClick={() => setActiveElement("1")}
          >
            Customer
          </span>
          <span
            className={` w-full cursor-pointer mb-5 hover:text-white text-black p-3 hover:bg-blue-600 rounded-lg ${
              active === "2" ? "bg-blue-600 text-white" : "bg-transparent"
            }`}
            onClick={() => setActiveElement("2")}
          >
            Payment Method
          </span>
          <span
            className={` w-full cursor-pointer mb-5 hover:text-white text-black p-3 hover:bg-blue-600 rounded-lg ${
              active === "3" ? "bg-blue-600 text-white" : "bg-transparent"
            }`}
            onClick={() => setActiveElement("3")}
          >
            Account Update
          </span>
        </div>
        <div className="flex bg-white lg:py-5 px-5 w-full">
          <>
            {active === "0" && <Supplier />}
            {active === "1" && <Customer />}
            {active === "2" && <PaymentMethod />}
            {active === "3" && <AdminUpdate />}
          </>
        </div>
      </div>

      <div className="flex-col lg:hidden">
        <div className=" px-8 py-3 border-t-2 border-b-2 border-gray-300">
          <div className="flex-col">
            <div className="flex" onClick={() => setActiveElement("0")}>
              <p className="font-bold">Supplier List</p>
              <div className="ml-auto w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {active === "0" && (
          <div className="mt-5 px-3">
            <Supplier />
          </div>
        )}
        <div className="flex-col lg:hidden px-8 py-3 border-b-2 border-gray-300">
          <div className="flex-col">
            <div className="flex" onClick={() => setActiveElement("1")}>
              <p className="font-bold">Customer List</p>
              <div className="ml-auto w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {active === "1" && (
          <div className="mt-5 px-3">
            <Customer />
          </div>
        )}
        <div className="flex-col lg:hidden px-8 py-3 border-b-2 border-gray-300">
          <div className="flex-col">
            <div className="flex" onClick={() => setActiveElement("2")}>
              <p className="font-bold">Payment Method</p>
              <div className="ml-auto w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {active === "2" && (
          <div className="mt-5 px-3">
            <PaymentMethod />
          </div>
        )}
        <div className="flex-col lg:hidden px-8 py-3 border-b-2 border-gray-300">
          <div className="flex-col">
            <div className="flex" onClick={() => setActiveElement("3")}>
              <p className="font-bold">Account Update</p>
              <div className="ml-auto w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {active === "3" && (
          <div className="mt-5 px-3">
            <AdminUpdate />
          </div>
        )}
      </div>
    </div>
  );
}
