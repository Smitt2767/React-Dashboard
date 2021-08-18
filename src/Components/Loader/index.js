import React from "react";

const Loader = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="w-full flex items-center  justify-center ">
        <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
