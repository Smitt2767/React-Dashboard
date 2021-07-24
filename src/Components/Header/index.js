import React from "react";
import DesktopHeader from "./DesktopHeader";

const index = ({ openMenu, setOpenMenu }) => {
  return (
    <div className="h-16 w-full bg-gray-800 pl-0 lg:pl-64 absolute top-0 shadow-2 xl">
      <DesktopHeader openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
};

export default index;
