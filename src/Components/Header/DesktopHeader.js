import React from "react";
import { BsSearch, BsBell } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";

const DesktopHeader = ({ openMenu, setOpenMenu }) => {
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
        <div className="w-10 h-10 text-white bg-blue-600 rounded-full flex justify-center items-center cursor-pointer hover:bg-blue-700">
          <span className="font-bold text-2xl">S</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
