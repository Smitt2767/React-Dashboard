import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Menu from "./Menu";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import { useSelector, useDispatch } from "react-redux";
import {
  handleDelete,
  handleColumnNameChnage,
  handleColumnTypeChange,
  handleColumnTextInputChnage,
  handleColumnNumberInputChange,
  handleColumnDateInputChnage,
} from "./store/agGridSlice";
import DateInput from "./DateInput";

const GenerateQueryBlock = ({ column }) => {
  const { columns, types } = useSelector((state) => state.agGrid);
  const dispatch = useDispatch();

  const [showNameMenu, setShowNameMenu] = useState(false);
  const [showTypesMenu, setShowTypesMenu] = useState(false);

  const handleColumnNameClick = (value) => {
    setShowNameMenu(false);
    dispatch(handleColumnNameChnage({ id: column.id, value }));
  };

  const handleTypeClick = (value) => {
    setShowTypesMenu(false);
    dispatch(handleColumnTypeChange({ id: column.id, value }));
  };

  return (
    <div className="flex w-full items-center mb-2 ">
      <button
        className="text-xl text-gray-700 bg-gray-300 rounded-full p-2 mr-3"
        onClick={() => dispatch(handleDelete(column.id))}
      >
        <AiOutlineClose />
      </button>
      <div className="relative mr-3">
        <button
          className="px-3 py-1 rounded-full bg-yellow-500 text-gray-50 font-bold font-md mb-1"
          onClick={() => {
            setShowNameMenu(!showNameMenu);
          }}
        >
          {column.columnName}
        </button>
        {showNameMenu && (
          <Menu
            data={columns.map((column) => column.name)}
            handleClick={handleColumnNameClick}
          />
        )}
      </div>
      <div className="relative mr-3">
        <button
          className="px-3 py-1 rounded-full bg-green-500 text-gray-50 font-bold font-md mb-1"
          onClick={() => {
            setShowTypesMenu(!showTypesMenu);
          }}
        >
          {column.type}
        </button>
        {showTypesMenu && (
          <Menu data={types[column.filterType]} handleClick={handleTypeClick} />
        )}
      </div>
      <div className="relative mr-3">
        {column.filterType === "text" ? (
          <TextInput
            value={column.filter}
            onChange={(value) => {
              dispatch(handleColumnTextInputChnage({ id: column.id, value }));
            }}
          />
        ) : column.filterType === "number" ? (
          <NumberInput
            value1={column.filter}
            value2={column.filter2}
            type={column.type}
            onChange={(value) => {
              dispatch(
                handleColumnNumberInputChange({
                  id: column.id,
                  filter: value,
                })
              );
            }}
            onChange2={(value) => {
              dispatch(
                handleColumnNumberInputChange({
                  id: column.id,
                  filter: column.filter,
                  filterTo: value,
                })
              );
            }}
          />
        ) : (
          <DateInput
            value1={column.filter}
            value2={column.filter2}
            type={column.type}
            onChange={(value) => {
              dispatch(
                handleColumnDateInputChnage({
                  id: column.id,
                  filter: value,
                })
              );
            }}
            onChange2={(value) => {
              dispatch(
                handleColumnDateInputChnage({
                  id: column.id,
                  filter: column.filter,
                  filterTo: value,
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateQueryBlock;
