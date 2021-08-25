import React, { useState } from "react";

import { AiOutlineClose } from "react-icons/ai";
import GroupQuery from "./GroupQuery";
import Menu from "./Menu";
import { handleDelete, handleOperatorChange } from "./store/agGridSlice";
import { useSelector, useDispatch } from "react-redux";

const GenerateGroupQueryBlock = ({ column }) => {
  const [showOperatorMenu, setShowOperatorMenu] = useState(false);
  const dispatch = useDispatch();

  const handleOperatorClick = (value) => {
    setShowOperatorMenu(false);
    dispatch(handleOperatorChange({ id: column.id, value }));
  };

  return (
    <div className="flex w-full items-center mb-2 flex-wrap gap-2">
      <button
        className="text-xl text-gray-700 bg-gray-300 rounded-full p-2 mr-3"
        onClick={() => dispatch(handleDelete(column.id))}
      >
        <AiOutlineClose />
      </button>
      <GroupQuery column={column} condition="condition1" />
      <div className="relative mr-3">
        <button
          className="px-3 py-1 rounded-full bg-blue-500 text-gray-50 font-bold font-md mb-1"
          onClick={() => {
            setShowOperatorMenu(!showOperatorMenu);
          }}
        >
          {column.operator}
        </button>
        {showOperatorMenu && (
          <Menu data={["AND", "OR"]} handleClick={handleOperatorClick} />
        )}
      </div>
      <GroupQuery column={column} condition="condition2" />
    </div>
  );
};

export default GenerateGroupQueryBlock;
