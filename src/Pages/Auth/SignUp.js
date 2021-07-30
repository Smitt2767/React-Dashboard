import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../services/api";

const SignUp = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { isAuth } = useSelector((state) => state.auth);
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
      const res = await API.post("/auth/signup", {
        username: user.username,
        email: user.email,
        password: user.password,
      });

      if (res.status && res.data.success) {
        setSuccessMessage(res.data.message);
        setUser({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
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
            className=" w-96 max-w-sm flex flex-col shadow-xl rounded-md p-4 bg-gray-100 "
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="text-gray-700 text-center mb-2 text-4xl">Signup</h1>
            <div className="border-b-2 border-gray-200 mb-2"></div>
            {errorMessage && (
              <div className="text-red-500 font-bold"> {errorMessage}</div>
            )}
            {successMessage && (
              <div className="text-green-500 font-bold"> {successMessage}</div>
            )}
            <label className="mb-1 text-xl" htmlFor="username">
              Username
            </label>

            <input
              type="text"
              placeholder="Username..."
              className="bg-transparent border-2 border-gray-400 rounded-md px-4 py-2 mb-4 focus:outline-none"
              id="username"
              value={user.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
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
            <label className="mb-1 text-xl" htmlFor="password2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password..."
              className="bg-transparent border-2 border-gray-400 rounded-md px-4 py-2 mb-4 focus:outline-none"
              id="password2"
              value={user.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
            />
            <Link
              to="/login"
              className="mb-2 mt-4 text-gray-400 ml-2 hover:text-gray-700 font-bold text-lg"
            >
              Already have an account? login here.
            </Link>
            <button
              className="border-2 border-blue-700 py-2 text-xl font-bold text-gray-600  rounded-full hover:bg-blue-700 hover:text-gray-50"
              onClick={onSubmit}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SignUp;
