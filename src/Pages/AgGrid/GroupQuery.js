import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Menu from "./Menu";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import DateInput from "./DateInput";
import {
  handleColumnNameChnage,
  handleColumnTypeChange,
  handleColumnTextInputChnage,
  handleColumnNumberInputChange,
  handleColumnDateInputChnage,
} from "./store/agGridSlice";

const GroupQuery = ({ column, condition }) => {
  const dispatch = useDispatch();
  const { columns, types } = useSelector((state) => state.agGrid);
  const [showNameMenu, setShowNameMenu] = useState(false);
  const [showTypesMenu, setShowTypesMenu] = useState(false);

  const handleColumnNameClick = (value) => {
    setShowNameMenu(false);
    dispatch(handleColumnNameChnage({ id: column.id, value }));
  };
  const handleTypeClick = (value) => {
    setShowTypesMenu(false);
    dispatch(
      handleColumnTypeChange({
        id: column.id,
        value,
        condition,
      })
    );
  };

  return (
    <div className="flex items-center ">
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
          {column[condition].type}
        </button>
        {showTypesMenu && (
          <Menu
            data={types[column[condition].filterType]}
            handleClick={handleTypeClick}
          />
        )}
      </div>
      <div className="relative mr-3">
        {column.filterType === "text" ? (
          <TextInput
            value={column[condition].filter}
            onChange={(value) => {
              dispatch(
                handleColumnTextInputChnage({ id: column.id, value, condition })
              );
            }}
          />
        ) : column.filterType === "number" ? (
          <NumberInput
            value={column[condition].filter}
            value2={column[condition].filterTo}
            type={column[condition].type}
            onChange={(value) => {
              dispatch(
                handleColumnNumberInputChange({
                  id: column.id,
                  filter: value,
                  condition,
                })
              );
            }}
            onChange2={(value) => {
              dispatch(
                handleColumnNumberInputChange({
                  id: column.id,
                  filter: column[condition].filter,
                  filterTo: value,
                  condition,
                })
              );
            }}
          />
        ) : (
          <DateInput
            value={column[condition].filter}
            value2={column[condition].filterTo}
            type={column[condition].type}
            onChange={(value) => {
              dispatch(
                handleColumnDateInputChnage({
                  id: column.id,
                  filter: value,
                  condition,
                })
              );
            }}
            onChange2={(value) => {
              dispatch(
                handleColumnDateInputChnage({
                  id: column.id,
                  filter: column[condition].filter,
                  filterTo: value,
                  condition,
                })
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GroupQuery;
