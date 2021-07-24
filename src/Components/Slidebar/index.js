import React from "react";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";

const index = ({ openMenu, setOpenMenu }) => {
  return (
    <div className="h-full absolute left-0 bg-gray-800 z-40">
      <MobileSidebar />
      <DesktopSidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
};

export default index;
