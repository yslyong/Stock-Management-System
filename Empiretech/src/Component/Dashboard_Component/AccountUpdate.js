import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getOutlet, getRole } from "../../Context/DbContext";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { ErrorMessage } from "@hookform/error-message";

export default function AccountUpdate() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { updatePassword, updateInfo, signout, clearInfo } = useAuth();
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

  const currentUser = localStorage.getItem("email");
  const userInfo = JSON.parse(localStorage.getItem("user"));
  var editInfo = true;

  if (userInfo.Role_Name === "Owner") {
    editInfo = false;
  }
  if (userInfo.Role_Name === "Admin") {
    editInfo = true;
  }
  if (userInfo.Role_Name === "Sales") {
    editInfo = true;
  }
  if (userInfo.Role_Name === "Logistic") {
    editInfo = true;
  }

  const onSubmit = (data) => submitData(data);
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
          history.replace("/Login");
        } else {
          setCountdown(countdown - 1);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  });

  async function submitData(data) {
    const promises = [];

    if (data.Password !== "") {
      promises.push(updatePassword(data.Password));
      promises.push(signout());
    }

    if (data) {
      promises.push(updateInfo(data));
    }

    Promise.all(promises)
      .then(() => {
        clearInfo();
        signout();
        history.push("/");
      })
      .catch(() => {
        setError("Fail to Update Account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-full">
      {isSubmitSuccessful && error.length === 0 && (
        <div className="mt-8 space-y-4 py-8 px-4 md:py-12 md:px-8 shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 Z-50">
          <h1 className="lg:text-4xl text-2xl text-center font-bold">Account Upadated Successful</h1>
          <h1 className="lg:text-2xl text-lg text-center font-bold">Redirecting in</h1>
          <h1 className="lg:text-4xl text-2xl text-center font-bold">{countdown}</h1>
        </div>
      )}
      {!isSubmitSuccessful && (
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
                defaultValue={currentUser}
                readOnly={true}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border bg-gray-200 border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div className="mb-2">
              <label htmlFor="Staff Password" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Staff Password
              </label>
              <input
                id="Password"
                name="Password"
                type="Password"
                autoComplete="Password"
                placeholder="Leave blank to keep the same"
                ref={register}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                    defaultValue={userInfo.Staff_Name}
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
                    readOnly={true}
                    defaultValue={userInfo.Staff_Nickname}
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
                defaultValue={userInfo.Staff_ICNo}
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
                defaultValue={userInfo.Staff_DOB}
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
                defaultValue={userInfo.Staff_Contact}
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
                        <>
                          <option
                            value={outlet.Outlet_Name}
                            key={outlet.Outlet_ID}
                            selected={userInfo.Outlet_Name === outlet.Outlet_Name}
                            disabled={userInfo.Outlet_Name !== outlet.Outlet_Name}
                          >
                            {outlet.Outlet_ID} - {outlet.Outlet_Name}
                          </option>
                        </>
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
                    {!get ? (
                      roles.map((role, idx) => (
                        <>
                          <option
                            value={role.Role_Name}
                            key={role.Role_ID}
                            selected={userInfo.Role_Name === role.Role_Name}
                            disabled={userInfo.Role_Name !== role.Role_Name}
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
          </div>
        </form>
      )}
    </div>
  );
}
