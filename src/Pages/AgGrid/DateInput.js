import React from "react";

const DateInput = ({ value1, value2, type, onChange, onChange2 }) => {
  return (
    <div className="flex items-center">
      <input
        value={value1}
        type="date"
        className="w-44 bg-transparent border-2 border-gray-400 py-0.5 px-2 rounded-full focus:outline-none text-gray-700 ml-2"
        onChange={(e) => onChange(e.target.value)}
      />
      {type === "inRange" && (
        <input
          value={value2}
          type="date"
          className="w-44 bg-transparent border-2 border-gray-400 py-0.5 px-2 rounded-full focus:outline-none text-gray-700 ml-2"
          onChange={(e) => onChange2(e.target.value)}
        />
      )}
    </div>
  );
};

export default DateInput;
