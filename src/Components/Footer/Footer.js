import React from "react";

const Footer = () => {
  return (
    <div className="h-full w-full text-right pr-8 flex items-center justify-end">
      <p className="text-gray-400 text-lg">
        &#169; {new Date().getFullYear()} React Dashboard
      </p>
    </div>
  );
};

export default Footer;
