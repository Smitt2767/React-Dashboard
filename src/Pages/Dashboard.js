import React from "react";

const Dashboard = () => {
  return (
    <div
      className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col border-2 border-red-500"
      style={
        {
          // height: "1000px",
          //   background: "linear-gradient(to bottom right, blue, red)",
        }
      }
    >
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer">
        Dashboard
      </h1>
    </div>
  );
};

export default Dashboard;
