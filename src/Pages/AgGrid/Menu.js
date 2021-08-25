import React from "react";

const Menu = ({ data, handleClick }) => {
  return (
    <div className="absolute bg-gray-700 shadow-lg z-50 max-h-80 overflow-y-auto scrollRightPanel rounded-lg">
      {data.map((item, i) => {
        return (
          <p
            className={`cursor-pointer text-lg font-bold text-gray-50 hover:bg-gray-800 px-3 py-2 ${
              data.length - 1 !== i ? "border-b border-gray-50" : ""
            }`}
            onClick={() => handleClick(item)}
            key={item}
          >
            {item}
          </p>
        );
      })}
    </div>
  );
};

export default Menu;
