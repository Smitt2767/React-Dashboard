import React from "react";

const TextInput = ({ onChange, value }) => {
  return (
    <div className="flex items-center ">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 bg-transparent border-2 border-gray-400 py-0.5 px-2 rounded-full focus:outline-none text-gray-700"
        placeholder="Enter value"
      />
    </div>
  );
};

export default TextInput;
