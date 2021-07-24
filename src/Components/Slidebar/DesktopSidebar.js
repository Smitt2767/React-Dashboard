import React from "react";
import SidebarContent from "./SidebarContent";

const DesktopSidebar = ({ openMenu, setOpenMenu }) => {
  return (
    <aside className={`h-full w-64 ${openMenu ? "block" : "hidden"} lg:block`}>
      <SidebarContent setOpenMenu={setOpenMenu} openMenu={openMenu} />
    </aside>
  );
};

export default DesktopSidebar;
