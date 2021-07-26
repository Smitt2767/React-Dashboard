import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "./store/dashboardSlice";
import Sidebar from "./Components/Slidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Dashboard from "./Pages/Dashboard";
import _404 from "./Pages/_404";

import Ckeditor from "./Pages/Ckeditor";
import CKList from "./Pages/Ckeditor/CKList";
import Signature from "./Pages/Signature";

import { IoAlertCircleOutline } from "react-icons/io5";
import AutoCompleteForm from "./Pages/AutoCompleteForm";

const App = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { successMessage, errorMessage } = useSelector(
    (state) => state.dashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let id;
    if (successMessage || errorMessage) {
      id = setTimeout(() => {
        dispatch(setSuccessMessage(""));
        dispatch(setErrorMessage(""));
      }, [5000]);
    }
    return () => clearTimeout(id);
  }, [successMessage, errorMessage, dispatch]);

  const alert = {
    show: successMessage ? true : errorMessage ? true : false,
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

        {alert.show && (
          <div
            className={`z-50 pt-2 absolute right-5 top-20 bg-opacity-80 cusrsor-pointer flex flex-col  rounded-t-xl shadow-xl ${alert.bgColor} ${alert.textColor} alert`}
          >
            <div className="flex items-center px-4 mb-2">
              <IoAlertCircleOutline className="text-3xl" />
              <p className="font-bold text-xl ml-4 ">{alert.message}</p>
            </div>

            <div
              className={`border-b-2 ${alert.borderColor} alert-progress`}
            ></div>
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

            <Route path="/ckeditor" exact component={Ckeditor} />
            <Route path="/ckeditor/:id" exact component={Ckeditor} />
            <Route path="/ckeditorlist" exact component={CKList} />
            <Route path="/form" exact component={AutoCompleteForm} />
            <Route path="/signature" exact component={Signature} />
            <Route component={_404} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
