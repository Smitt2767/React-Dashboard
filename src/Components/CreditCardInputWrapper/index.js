import React from "react";

const CreditCardInputWrapper = ({ Icon, children, label, errorMessage }) => {
  return (
    <div className="w-full mb-4 ">
      <p className="text-gray-600 font-bold text-sm pb-1 pl-1 ">{label}</p>
      <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 ">
        <div className="flex-none mr-3">
          <Icon />
        </div>
        <div className="flex-grow">{children}</div>
      </div>
      <p className="text-red-600 text-xs font-bold pl-1 ">{errorMessage}</p>
    </div>
  );
};

export default CreditCardInputWrapper;
