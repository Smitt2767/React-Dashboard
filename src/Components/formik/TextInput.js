import React from "react";

const TextInput = (props) => {
  const {
    lableName = "",
    required = true,
    type = "text",
    placeholder = "",
    name = "",
    onChange,
    onBlur,
    value = "",
    errorMessage = "",
  } = props;

  return (
    <div className="flex flex-col lg:mr-4 md:mr-2 mr-0 w-full mb-2 lg:mb-0">
      <label className="text-sm lg:text-lg font-bold text-gray-700 mb-1">
        {lableName} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="focus:outline-none text-sm p-2 bg-gray-100 border border-gray-400 rounded-md text-gray-700"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />

      <p className="text-red-500 text-sm pl-1">{errorMessage}</p>
    </div>
  );
};

export default TextInput;
