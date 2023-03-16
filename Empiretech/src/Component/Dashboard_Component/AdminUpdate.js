import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getOutlet, getRole, getUserByEmail } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";
import { ErrorMessage } from "@hookform/error-message";
import { useAuth } from "../../Context/AuthContext";

export default function AccountUpdate() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [edit, setEdit] = useState(false);
  const [complete, setComplete] = useState(false);
  const { updateInfo } = useAuth();

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitSuccessful },
  } = useForm();
  const history = useHistory();
  const [outlets, setOutlets] = useState();
  const [roles, setRoles] = useState();
  const [user, setUser] = useState();
  const [query, setQuery] = useState("");

  const onSubmit = (data) => submitData(data);
  const getQuery = (data) => submitQuery(data);

  const userInfo = JSON.parse(localStorage.getItem("user"));
  var permission = 1;
  if (userInfo.Role_Name === "Admin") {
    permission = 1;
  }

  useEffect(() => {
    if (outlets === undefined) {
      getOutlet().then((value) => {
        setOutlets(value);
      });
    }
    if (roles === undefined) {
      getRole().then((value) => {
        setRoles(value);
      });
    }
    if (user === undefined && query !== "") {
      getUserByEmail(query).then((value) => {
        setUser(value);
        console.log(value);
      });
    }

    return () => {};
  });

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      if (isSubmitSuccessful && complete) {
        if (countdown === 0) {
          history.replace("/Dashboard/Config");
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
      updateInfo(data);
      setComplete(true);
    } catch {
      setError("Fail to Update Account");
    }
    setLoading(false);
  }

  function submitQuery(data) {
    console.log("data");
    setQuery(data.Email_Query);
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && error.length === 0 && complete && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Account Updated Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}

      <div>
        <form className="flex lg:flex-row flex-col" onSubmit={handleSubmit(getQuery)}>
          <label htmlFor="StaffEmail" className="px-1 py-2 font-semibold text-lg text-gray-800">
            Search Email :
          </label>
          <div className="flex lg:flex-row flex-col w-full lg:w-auto lg:ml-3">
            <input
              id="Email_Query"
              name="Email_Query"
              type="email"
              autoComplete="Email_Query"
              required
              ref={register}
              className="md:mt-2 mb-3 rounded-md lg:w-96 relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            ></input>
            <button
              type="submit"
              className="group relative mb-3 lg:ml-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search Account
            </button>
            <button
              type="button"
              className="group relative mb-3 lg:ml-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => history.go(0)}
            >
              Cancel Update
            </button>
          </div>
        </form>
      </div>

      {query !== "" && user !== undefined ? (
        <form
          className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 rounded-lg ring-opacity-20 Z-50"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Account Update Form</h1>
          {error && <p className="text-red-600 text-lg font-bold">{error}</p>}
          <div>
            <div className="mb-2">
              <label htmlFor="StaffEmail" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Email
              </label>
              <input
                id="Email"
                name="Email"
                type="text"
                autoComplete="Email"
                required
                ref={register}
                defaultValue={user.Staff_Email}
                readOnly
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="flex mt-0">
              <div className="flex-1 pr-5">
                <div className="mb-2">
                  <label htmlFor="StaffName" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Staff Name
                  </label>
                  <input
                    id="Name"
                    name="Name"
                    type="text"
                    autoComplete="Name"
                    required
                    defaultValue={user.Staff_Name}
                    ref={register}
                    className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  ></input>
                </div>
              </div>
              <div className="flex-1 pl-5">
                <div className="mb-2">
                  <label htmlFor="Nickname" className="px-1 py-4 font-semibold text-lg text-gray-800">
                    Staff Nickname
                  </label>
                  <input
                    id="NickName"
                    name="NickName"
                    type="text"
                    autoComplete="NickName"
                    required
                    readOnly
                    defaultValue={user.Staff_Nickname}
                    ref={register({
                      pattern: {
                        value: /^\S*$/,
                        message: "No Space Allowed",
                      },
                    })}
                    className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                defaultValue={user.Staff_ICNo}
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
                defaultValue={user.Staff_DOB}
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
                defaultValue={user.Staff_Contact}
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
                    readOnly={!edit}
                    ref={register}
                  >
                    {outlets ? (
                      outlets.map((outlet, idx) => (
                        <option
                          value={outlet.Outlet_Name}
                          key={outlet.Outlet_ID}
                          selected={user.Outlet_Name === outlet.Outlet_Name}
                        >
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
                  >
                    {roles ? (
                      roles.map((role, idx) => (
                        <>
                          <option
                            value={role.Role_Name}
                            key={role.Role_ID}
                            selected={user.Role_Name === role.Role_Name}
                            disabled={role.Role_ID < permission}
                          >
                            {role.Role_ID} - {role.Role_Name}
                          </option>
                        </>
                      ))
                    ) : (
                      <option value="Error">Error</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            {user.Role_Name !== "Owner" && (
              <div className="flex align-middle">
                <button
                  type="submit"
                  className="group relative mr-auto lg:mr-5 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Update Account
                </button>
                <button
                  type="reset"
                  className="group relative ml-auto lg:ml-2 justify-center py-2 px-4 border border-transparent text-lg rounded-md text-black hover:text-white font-bold border-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Reset Form
                </button>
              </div>
            )}
          </div>
        </form>
      ) : (
        user === undefined &&
        query !== "" && (
          <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
            <h1 className="lg:text-2xl text-lg text-center font-bold">Loading User Info</h1>
          </div>
        )
      )}

      {user !== undefined && user.length === 0 && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-2xl text-lg text-center font-bold">User Info No Found</h1>
        </div>
      )}
    </div>
  );
}
