import React from "react";

const _404 = () => {
  return (
    <div className="w-full h-full pl-0 lg:pl-64 pt-16 pb-8">
      <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
        <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-4">
          Page Not Found
        </h1>
        <div className="h-full w-full overflow-y-auto border-2 border-red-400"></div>
      </div>
    </div>
  );
};

export default _404;
