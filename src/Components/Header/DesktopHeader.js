import React from "react";
import { BsSearch, BsBell } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { useSelector } from "react-redux";
import ProfileImg from "../ProfileImg";

const DesktopHeader = ({ openMenu, setOpenMenu }) => {
  const { username } = useSelector((state) => state.auth);
  return (
    <div className=" h-full flex items-center justify-between px-2 lg:px-8">
      <div
        className="text-3xl text-gray-300 hover:text-gray-50 mx-2 cursor-pointer block lg:hidden"
        onClick={() => {
          if (!openMenu) setOpenMenu(true);
        }}
      >
        <AiOutlineMenu />
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full border border-gray-400 text-white py-2 px-4 mx-2 max-w-lg  rounded flex items-center">
          <BsSearch />
          <input
            type="text"
            className="bg-transparent w-full mx-3 focus:outline-none"
            placeholder="Search here..."
          />
        </div>
      </div>

      <div className="flex-none flex items-center">
        <div className="mr-3 md:mr-6 relative cursor-pointer text-gray-300 hover:text-gray-50">
          <BsBell className="text-xl " />
          <div className="absolute rounded-full h-2 w-2 top-0 right-0 bg-blue-400"></div>
        </div>
        <ProfileImg username={username} size={85} />
      </div>
    </div>
  );
};

export default DesktopHeader;
