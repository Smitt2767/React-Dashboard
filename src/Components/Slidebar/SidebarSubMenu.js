import React, { useState } from "react";
import { Link } from "react-router-dom";

const SidebarSubMenu = ({ routes, openMenu, setOpenMenu }) => {
  const [active, setActive] = useState(
    routes.find((route) => window.location.pathname === route.path)?.id || 0
  );

  return (
    <div className="w-full pl-10 pr-6">
      <div className="flex flex-col rounded px-8 py-4 bg-gray-900">
        {routes.map((route) => {
          const textColor =
            active === route.id ? "text-gray-100" : "text-gray-400";
          return (
            <React.Fragment key={route.id}>
              <Link
                to={route.path}
                className={`py-1 ${textColor}`}
                onClick={() => {
                  setActive(route.id);
                  if (openMenu) setOpenMenu(false);
                }}
              >
                {route.name}
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarSubMenu;
