import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getDataFromLocalStorage } from "../../services/jwtService";
const PrivateRoute = ({
  component: Component,
  openMenu,
  setOpenMenu,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return getDataFromLocalStorage() ? (
          <div
            className="w-full h-full pl-0 lg:pl-64 pt-16 pb-8"
            onClick={() => {
              if (openMenu) setOpenMenu(false);
            }}
          >
            <Component {...props} />
          </div>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
