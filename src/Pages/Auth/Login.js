import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate } from "../../services/jwtService";
import { useSelector } from "react-redux";
import API from "../../services/api";

const Login = (props) => {
  const { isAuth } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let id;
    if (successMessage || errorMessage) {
      id = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, [5000]);
    }
    return () => clearTimeout(id);
  }, [successMessage, errorMessage]);

  const handleInputChange = (type, value) => {
    setUser({
      ...user,
      [type]: value,
    });
  };

  const onSubmit = async () => {
    try {
      const res = await API.post("/auth/login", {
        email: user.email,
        password: user.password,
      });
      if (res.status && res.data.success) {
        setUser({
          email: "",
          password: "",
        });
        authenticate(
          { token: res.data.data.token, user: res.data.data.user },
          () => {
            API.defaults.headers.common["Authorization"] =
              "Bearer " + res.data.data.token;
            props.history.push("/");
          }
        );
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message);
    }
  };

  return (
    <>
      {isAuth ? (
        <Redirect to={props.location.state.from.pathname} />
      ) : (
        <div className="h-screen w-full p-5 flex justify-center items-center bg-gray-700">
          <form
            className=" w-96 max-w-sm flex flex-col shadow-xl rounded-md p-4 bg-gray-100"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="text-gray-700 text-center mb-2 text-4xl">Login</h1>
            <div className="border-b-2 border-gray-200 mb-12"></div>
            {errorMessage && (
              <div className="text-red-500 font-bold"> {errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 font-bold"> {successMessage}</div>
            )}

            <label className="mb-1 text-xl" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Email..."
              className="bg-transparent border-2 border-gray-400 rounded-md px-4 py-2 mb-4 focus:outline-none"
              id="email"
              value={user.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <label className="mb-1 text-xl" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password..."
              className="bg-transparent border-2 border-gray-400 rounded-md px-4 py-2 mb-4 focus:outline-none"
              id="password"
              value={user.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />

            <Link
              to="/signup"
              className="mb-2 mt-12 text-gray-400 ml-2 hover:text-gray-700 font-bold text-lg"
            >
              Don't have an account? signup here.
            </Link>
            <button
              className="border-2 border-blue-700 py-2 text-xl font-bold text-gray-600  rounded-full hover:bg-blue-700 hover:text-gray-50"
              type="submit"
              onClick={onSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
