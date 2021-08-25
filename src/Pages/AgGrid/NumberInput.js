import React from "react";

const NumberInput = ({ value1, value2, type, onChange, onChange2 }) => {
  return (
    <div className="flex items-center ">
      <input
        type="number"
        value={value1}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 bg-transparent border-2 border-gray-400 py-0.5 px-2 rounded-full focus:outline-none text-gray-700"
        placeholder="Enter value"
      />
      {type === "inRange" && (
        <input
          type="number"
          value={value2}
          onChange={(e) => onChange2(e.target.value)}
          className="w-32 bg-transparent border-2 border-gray-400 py-0.5 px-2 rounded-full focus:outline-none text-gray-700 ml-2"
          placeholder="Enter value"
        />
      )}
    </div>
  );
};

export default NumberInput;
