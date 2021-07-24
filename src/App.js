import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

import Ckeditor from './Pages/Ckeditor'

const App = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className="h-screen relative">
      <Router>
        <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <Footer />
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
            <Route component={_404} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
