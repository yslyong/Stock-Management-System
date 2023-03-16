import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getOutlet, getRole } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ErrorMessage } from "@hookform/error-message";

export default function AccountCreate() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { signup, addname } = useAuth();

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitSuccessful },
  } = useForm();
  const history = useHistory();
  const [outlets, setOutlets] = useState([]);
  const [roles, setRoles] = useState([]);
  const [get, setGet] = useState(true);

  const onSubmit = (data) => submitData(data);

  const userInfo = JSON.parse(localStorage.getItem("user"));
  var permission = 1;
  if (userInfo.Role_Name === "Admin") {
    permission = 1;
  }

  useEffect(() => {
    if (outlets.length === 0) {
      getOutlet().then((value) => {
        setOutlets(value);
      });
    }

    if (roles.length === 0) {
      getRole().then((value) => {
        setRoles(value);
      });
    }

    return () => {
      setGet(false);
    };
  });

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful) {
        if (countdown === 0) {
          history.replace("/Dashboard/Login");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  async function submitData(data) {
    try {
      setError("");
      setLoading(true);
      //console.log(data, outlets);
      await signup(data.Email, data.Password);
      await addname(data);
      //history.push("/Login");
    } catch {
      setError("Duplicate User Email - Enter A New Email!");
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && error === "" && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Account Created Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {!isSubmitSuccessful && (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 rounded-lg ring-gray-400 ring-opacity-20 Z-50"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Account Create Form</h1>
          {error && <p className="text-red-600 text-lg font-bold">{error}</p>}
          <div>
            <div className="mb-2">
              <label htmlFor="ProductCode" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Email
              </label>
              <input
                id="Email"
                name="Email"
                type="Email"
                autoComplete="Email"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductCode" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                autoComplete="Email"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="flex mt-0">
              <div className="flex-1 pr-5">
                <div className="mb-2">
                  <label htmlFor="productName" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Staff Name
                  </label>
                  <input
                    id="Name"
                    name="Name"
                    type="text"
                    autoComplete="Name"
                    required
                    ref={register}
                    className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                </div>
              </div>
              <div className="flex-1 pl-5">
                <div className="mb-2">
                  <label htmlFor="productName" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Staff Nickname
                  </label>
                  <input
                    id="NickName"
                    name="NickName"
                    type="text"
                    autoComplete="NickName"
                    required
                    ref={register({
                      pattern: {
                        value: /^\S*$/,
                        message: "No Space Allowed",
                      },
                    })}
                    className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                  <ErrorMessage
                    errors={errors}
                    name="NickName"
                    render={({ message }) => (
                      <p className="flex items-center tracking-wide text-red-500 mt-1 ml-1">{message}</p>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductPrice" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff IC No or Passport No
              </label>
              <input
                id="ICNo"
                name="ICNo"
                type="text"
                autoComplete="ICNo"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductPrice" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Date of Birth
              </label>
              <input
                id="DOB"
                name="DOB"
                type="Date"
                autoComplete="DOB"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="ProductCategory" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Contact No
              </label>
              <input
                id="ContactNo"
                name="ContactNo"
                type="text"
                autoComplete="ContactNo"
                required
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-5">
              <div className="flex mt-0">
                <div className="flex-1 pr-5">
                  <label htmlFor="Outlet" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Outlet Assigned
                  </label>
                  <select
                    id="Outlet_Name"
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name="Outlet_Name"
                    type="text"
                    autoComplete="Outlet_Name"
                    required
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
                    Role Assigned
                  </label>
                  <select
                    id="Role_Name"
                    className="md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    name="Role_Name"
                    type="text"
                    autoComplete="Role_Name"
                    required
                    ref={register}
                    defaultValue={userInfo.Role_Name}
                  >
                    {!get ? (
                      roles.map((role, idx) => (
                        <option value={role.Role_Name} key={role.Role_ID} disabled={role.Role_ID < permission}>
                          {role.Role_ID} - {role.Role_Name}
                        </option>
                      ))
                    ) : (
                      <option value="Error">Error</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex align-middle">
              <button
                type="submit"
                className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Create Account
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
