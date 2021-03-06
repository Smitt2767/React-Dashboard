import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Pages/Auth/PrivateRoute";

import { useSelector, useDispatch } from "react-redux";
import { setErrorMessage, setSuccessMessage } from "./store/dashboardSlice";
import { setAuthData } from "./Pages/Auth/store/authSlice";

import { IoAlertCircleOutline } from "react-icons/io5";

import Sidebar from "./Components/Slidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Dashboard from "./Pages/Dashboard";
import _404 from "./Pages/_404";

import Ckeditor from "./Pages/Ckeditor";
import CKList from "./Pages/Ckeditor/CKList";
import Signature from "./Pages/Signature";
import AutoCompleteForm from "./Pages/AutoCompleteForm";
import Chat from "./Pages/Chat";
import Signup from "./Pages/Auth/SignUp";
import Login from "./Pages/Auth/Login";
import PrivateChat from "./Pages/PrivateChat";
import AgGrid from "./Pages/AgGrid";
import ImageGallery from "./Pages/ImageGallery";
import CreditCardForm from "./Pages/CreditCard";
import { connectWithWebSocket, joinChatRoom } from "./services/socket";
import { getDataFromLocalStorage } from "./services/jwtService";

import API from "./services/api";
import CreditCardData from "./Pages/CreditCard/CreditCardData";

const App = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { successMessage, errorMessage } = useSelector(
    (state) => state.dashboard
  );
  const { isAuth, username } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (localStorage.getItem("token")) {
    API.defaults.headers.common["Authorization"] =
      "Bearer " + JSON.parse(localStorage.getItem("token"));
  }

  const user = getDataFromLocalStorage();
  if (user) {
    dispatch(
      setAuthData({
        username: user.username,
        isAuth: !!user,
        avatar: user.avatar || null,
      })
    );
  }

  useEffect(() => {
    if (isAuth && username) {
      connectWithWebSocket();
      joinChatRoom(username);
    }
  }, [username, isAuth]);

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
        {isAuth && (
          <>
            <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <Footer />
          </>
        )}
        {alert.show && (
          <div
            className={`z-50 pt-2 absolute right-5 ${
              isAuth ? "top-20" : "top-5"
            } bg-opacity-80 cusrsor-pointer flex flex-col  rounded-sm overflow-hidden shadow-xl ${
              alert.bgColor
            } ${alert.textColor} alert`}
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

        <Switch>
          <Route path="/signup" exact component={Signup} />
          <Route path="/login" exact component={Login} />
          <PrivateRoute
            path="/"
            exact
            component={Dashboard}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/ckeditor"
            exact
            component={Ckeditor}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/ckeditor/:id"
            exact
            component={Ckeditor}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/ckeditorlist"
            exact
            component={CKList}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/form"
            exact
            component={AutoCompleteForm}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/signature"
            exact
            component={Signature}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/globalChat"
            exact
            component={Chat}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/privateChat"
            exact
            component={PrivateChat}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/agGrid"
            exact
            component={AgGrid}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/imageGallery"
            exact
            component={ImageGallery}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/creditCardForm/:id"
            exact
            component={CreditCardForm}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/creditCardForm"
            exact
            component={CreditCardForm}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <PrivateRoute
            path="/creditCardList"
            exact
            component={CreditCardData}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
          <Route component={_404} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
