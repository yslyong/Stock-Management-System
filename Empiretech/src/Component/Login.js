import React, { useRef, useState } from "react";
import logo from "../assets/images/Logo.svg";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signin, getInfo } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handlerSubmit(e) {
    e.preventDefault();
    const promises = [];
    promises.push(signin(emailRef.current.value, passwordRef.current.value).then(getInfo(emailRef.current.value)));
    Promise.all(promises)
      .then(() => {
        history.push("/Dashboard");
      })
      .catch(() => {
        setError("Fail to Login");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8 lg:py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img src={logo} alt="logo" className="mx-auto max-h-32 md:max-h-48 w-auto" />
          <h1 className="mt-2 text-center text-3xl md:text-4xl font-extrabold text-gray-900">Empire Tech</h1>
        </div>

        <form
          className="mt-8 space-y-4 py-8 px-4 md:space-y-8 md:py-12 md:px-8  shadow-xl bg-white ring-2 ring-gray-400 ring-opacity-20 "
          onSubmit={handlerSubmit}
        >
          {error && <p>{error}</p>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="Username" className="px-1 py-4 font-semibold text-lg text-gray-800">
                Username
              </label>
              <input
                id="Username"
                name="Username"
                type="email"
                autoComplete="Username"
                required
                ref={emailRef}
                className="appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
            <div>
              <label htmlFor="password" className=" px-1 py-4 font-semibold text-lg text-gray-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                ref={passwordRef}
                className=" appearance-none md:mt-2 rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md 
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              ></input>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg rounded-md text-white font-bold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
