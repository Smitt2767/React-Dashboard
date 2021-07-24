import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "./store/dashboardSlice";
import Sidebar from "./Components/Slidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Contactus from "./Pages/Contactus";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import _404 from "./Pages/_404";

import Ckeditor from "./Pages/Ckeditor";
import CKList from "./Pages/Ckeditor/CKList";

import { IoAlertCircleOutline } from "react-icons/io5";

const App = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { successMessage, errorMessage } = useSelector(
    (state) => state.dashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let id;
    if (successMessage || errorMessage) {
      console.log("hi");
      id = setTimeout(() => {
        dispatch(setSuccessMessage(""));
        dispatch(setErrorMessage(""));
      }, [3000]);
    }
    return () => clearTimeout(id);
  }, [successMessage, errorMessage, dispatch]);

  const alert = {
    success: successMessage ? true : errorMessage ? false : null,
    bgColor: successMessage ? "bg-green-400" : errorMessage ? "bg-red-400" : "",
    textColor: successMessage
      ? "text-green-900"
      : errorMessage
      ? "text-red-900"
      : "",
    borderColor: successMessage
      ? "border-green-600"
      : errorMessage
      ? "border-red-600"
      : "",
    message: successMessage
      ? successMessage
      : errorMessage
      ? errorMessage
      : null,
  };

  return (
    <div className="h-screen relative">
      <Router>
        <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <Footer />

        {alert.success && (
          <div
            className={`z-50 py-2 px-4 absolute right-5 top-20 bg-opacity-80 cusrsor-pointer flex items-center rounded-sm shadow-xl border-b-2 ${alert.bgColor} ${alert.borderColor} ${alert.textColor}`}
          >
            <IoAlertCircleOutline className="text-3xl" />
            <p className=" font-bold text-xl ml-4">{alert.message}</p>
          </div>
        )}

        <div
          className="w-full h-full pl-0 lg:pl-64 pt-16 pb-8 overflow-y-auto"
          onClick={() => {
            if (openMenu) setOpenMenu(false);
          }}
        >
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/about" exact component={About} />
            <Route path="/contactus" exact component={Contactus} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/ckeditor" exact component={Ckeditor} />
            <Route path="/ckeditor/:id" exact component={Ckeditor} />
            <Route path="/ckeditorlist" exact component={CKList} />
            <Route component={_404} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
