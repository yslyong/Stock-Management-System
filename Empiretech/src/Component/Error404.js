import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Logo_Horizontal from "../assets/images/Logo_Horizontal.svg";

export default function Error404() {
  const history = useHistory();
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (timer === 0) {
        history.push("/Dashboard/");
      } else {
        setTimer(timer - 1);
        console.log(timer);
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  const location = useLocation().pathname.split("/");
  console.log(location);

  return (
    <>
      {location[1] !== "Dashboard" && (
        <div className="fixed w-full bg-white px-5 py-2 shadow-lg border-b-2 border-gray-200 z-50" id="header">
          <div className="flex flex-row justify-between">
            <div className="flex items-center">
              <button className="flex items-center my-auto h-10 w-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center">
              <img src={Logo_Horizontal} alt="logo" className="mx-auto h-10 w-auto" />
            </div>
            <div className="flex items-center">
              <button>
                <div className="rounded-full w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${location[1] !== "Dashboard" && "bg-gray-100 min-vh mt-12"}`}>
        <div
          className={`mt-8 space-y-4 py-8 px-4 md:px-8 text-center rounded-lg ${
            location[1] === "Dashboard" ? `ring-2 ring-gray-400 ring-opacity-20 shadow-xl bg-white` : "py-48"
          }`}
        >
          <div className="w-36 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="lg:text-6xl text-4xl text-center font-bold">404</h1>
          <h1 className="lg:text-2xl text-lg text-center font-semibold">Page not found</h1>
          <h1 className="lg:text-xl text-lg text-center font-medium">
            The page you are looking for doesn't exist or you do not have permission to access.
          </h1>
          <h1 className="lg:text-lg text-base text-center font-bold">Redirect in {timer} </h1>
        </div>
      </div>
    </>
  );
}
