import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

export default function Dropdown() {
  const { signout, clearInfo } = useAuth();
  const history = useHistory();

  const currentUser = localStorage.getItem("email");
  const UserInfo = JSON.parse(localStorage.getItem("user"));
  async function handlerLogout() {
    try {
      await signout();
      await clearInfo();
      history.push("/Login");
    } catch {}
  }

  return (
    <div className="p-3 py-5 border lg:w-2/12 w-8/12 ring-1 ring-gray-400 ring-opacity-20 Z-50 shadow-xl bg-white fixed top-18 right-0.5 z-10">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg">{UserInfo.Staff_Name}</h1>
        <h1 className="mb-3">{currentUser}</h1>
        <Link to="/Dashboard/AccountUpdate/">
          <h1 className="mb-5 text-sm cursor-pointer text-blue-700 underline">Manage your Empire Tech Account</h1>
        </Link>
        <button
          type="submit"
          onClick={handlerLogout}
          className="group relative flex justify-center p-2 border border-transparent rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
