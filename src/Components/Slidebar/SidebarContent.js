import React, { useState, useEffect } from "react";
import { RiDashboardLine } from "react-icons/ri";
import {
  AiOutlineHome,
  AiOutlineContacts,
  AiOutlineClose,
} from "react-icons/ai";
import {
  BsPeople,
  BsPeopleCircle,
  BsLayoutSplit,
  BsPower,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import SidebarSubMenu from "./SidebarSubMenu";

const routes = [
  {
    id: 1,
    path: "/",
    name: "Home",
    icon: <AiOutlineHome className="text-2xl" />,
  },
  {
    id: 2,
    path: "/profile",
    name: "Profile",
    icon: <BsPeopleCircle className="text-2xl" />,
  },

  {
    id: 3,
    name: "Pages",
    icon: <BsLayoutSplit className="text-2xl" />,
    routes: [
      { id: 1, path: "/login", name: "Login" },
      { id: 2, path: "/signup", name: "Signup" },
      { id: 3, path: "/404", name: "404" },
    ],
  },
  {
    id: 4,
    path: "/about",
    name: "About",
    icon: <BsPeople className="text-2xl" />,
  },
  {
    id: 5,
    path: "/contactus",
    name: "Contact Us",
    icon: <AiOutlineContacts className="text-2xl" />,
  },
];

const SidebarContent = ({ openMenu, setOpenMenu }) => {
  const [active, setActive] = useState(
    routes.find((route) => {
      if (route.routes?.length) {
        const r = route.routes.find((r) => r.path === window.location.pathname);
        if (r) {
          return route.id;
        }
      }
      return window.location.pathname === route.path;
    })?.id || 1
  );
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  useEffect(() => {
    const subMenusIds = routes
      .map((route) => {
        if (route.routes?.length) return route.id;
        return null;
      })
      .filter((value) => value !== null);

    if (!subMenusIds.includes(active))
      if (isSubMenuOpen) setIsSubMenuOpen(false);
  }, [active, isSubMenuOpen]);

  return (
    <div className="h-full flex flex-col text-white">
      <div className="h-16  flex items-center justify-end px-4 pt-4 block lg:hidden">
        <span
          className="cursor-pointer text-gray-800 text-2xl bg-gray-200 rounded-full p-2"
          onClick={() => {
            if (openMenu) setOpenMenu(false);
          }}
        >
          <AiOutlineClose />
        </span>
      </div>
      <h1 className="text-3xl flex items-center p-4 flex-none">
        <span>
          <RiDashboardLine />
        </span>
        <span className="px-3">Dashboard</span>
      </h1>

      <div className="h-full mt-2 overflow-y-auto flex flex-col flex-grow">
        {routes.map((route) => {
          const textColor =
            active === route.id ? "text-gray-100" : "text-gray-400";
          return (
            <React.Fragment key={route.id}>
              <div
                className={` flex items-center text-lg ${textColor} hover:text-gray-50 cursor-pointer`}
                onClick={() => {
                  setActive(route.id);
                }}
                to={route.path}
              >
                {active === route.id && !route?.routes?.length && (
                  <div className="bg-blue-400 rounded-r-lg w-1 h-full -mr-1 "></div>
                )}
                <div className="flex items-center w-full">
                  {!route?.routes?.length ? (
                    <Link
                      className="w-full flex items-center pl-10 py-3 "
                      onClick={() => {
                        setOpenMenu(false);
                      }}
                      to={route.path}
                    >
                      {route.icon}
                      <span className="ml-3 w-4/6">{route.name}</span>
                    </Link>
                  ) : (
                    <div
                      className="flex flex-col w-full "
                      onClick={() => {
                        setIsSubMenuOpen(!isSubMenuOpen);
                      }}
                    >
                      <div className="flex items-center w-full pl-10 py-3">
                        {route.icon}
                        <div className="ml-3 w-4/6 flex items-center justify-between">
                          <span>{route.name}</span>
                          <span>
                            {isSubMenuOpen ? (
                              <GoTriangleUp />
                            ) : (
                              <GoTriangleDown />
                            )}
                          </span>
                        </div>
                      </div>
                      {isSubMenuOpen && (
                        <div className="w-full">
                          <SidebarSubMenu
                            routes={route.routes}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex-none h-40 flex items-center text-4xl justify-center">
        <Link
          to="/"
          onClick={() => {
            setActive(1);
          }}
          className="bg-red-500 p-2 rounded-full hover:bg-red-600 text-gray-800 hover:text-gray-50"
        >
          <BsPower
            className="cursor-pointer"
            onClick={() => {
              if (openMenu) {
                setOpenMenu(false);
              }
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default SidebarContent;
