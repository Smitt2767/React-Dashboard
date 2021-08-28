import React, { useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import ReactJson from "react-json-view";
import Menu from "./Menu";
import Queries from "./Queries";
import { useSelector, useDispatch } from "react-redux";
import { addNewDefaultFilter, setFilters } from "./store/agGridSlice";

const menuData = ["Add Condition", "Add Group"];

const QueryBuilderModal = ({ setShowModal, gridApi }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { filters } = useSelector((state) => state.agGrid);
  const dispatch = useDispatch();

  const getFilterModel = () => {
    const filterModel = {};

    filters.forEach((column) => {
      filterModel[column.columnName] = {};
      if (!column.operator) {
        if (column.filterType === "date") {
          filterModel[column.columnName].dateFrom = column.filter;
          filterModel[column.columnName].dateTo = column.filterTo;
        } else {
          filterModel[column.columnName].filter = column.filter;
          if (column.type === "inRange")
            filterModel[column.columnName].filterTo = column.filterTo;
        }

        filterModel[column.columnName].filterType = column.filterType;
        filterModel[column.columnName].type = column.type;
      } else {
        filterModel[column.columnName].condition1 = {};
        filterModel[column.columnName].condition2 = {};
        filterModel[column.columnName].operator = column.operator;
        filterModel[column.columnName].filterType = column.filterType;
        ["condition1", "condition2"].forEach((condition) => {
          if (column[condition].fiterType === "date") {
            filterModel[column.columnName][condition].dateFrom =
              column[condition].filter;
            filterModel[column.columnName][condition].dateTo =
              column[condition].filterTo;
          } else {
            filterModel[column.columnName][condition].filter =
              column[condition].filter;
            if (column[condition].type === "inRange")
              filterModel[column.columnName][condition].filterTo =
                column[condition].filterTo;
          }

          filterModel[column.columnName][condition].type =
            column[condition].type;
          filterModel[column.columnName][condition].filterType =
            column[condition].filterType;
        });
      }
    });

    return filterModel;
  };

  const handleAddBtnClick = () => {
    setShowAddMenu(!showAddMenu);
  };

  const handleMenuOptionsClick = (value) => {
    setShowAddMenu(!showAddMenu);
    dispatch(addNewDefaultFilter(value));
  };

  const isDisabled = () => {
    return filters.some((column) => {
      if (!column.operator)
        if (column.filter === "" || column.filterTo === "") return true;
        else return false;
      else {
        if (
          column.condition1.filter === "" ||
          column.condition1.filterTo === "" ||
          column.condition2.filter === "" ||
          column.condition2.filterTo === ""
        )
          return true;
        else return false;
      }
    });
  };

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none close"
        onClick={(e) => {
          if (e.target.classList.contains("close")) {
            setShowModal(false);
          }
        }}
      >
        <div className={`relative w-5/6 h-full py-12 `}>
          {/*content*/}
          <div className="border-0 rounded-md shadow-lg relative w-full bg-gray-100 outline-none focus:outline-none w-full h-full rounded-xl">
            {/*body*/}
            <div className="flex flex-col items-start h-full relative p-8">
              <button
                className="text-gray-200 bg-gray-700 hover:bg-gray-800 hover:text-gray-50 p-3 rounded-full cursor-pointer focus:outline-none absolute -top-6 -right-6"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                <AiOutlineClose className="text-2xl" />
              </button>
              <div className="flex w-full items-center justify-between mb-4 flex-none">
                <h1 className="text-4xl font-bold text-gray-700">
                  Query Builder
                </h1>
              </div>
              <div className="flex flex-col lg:flex-row w-full h-full rounded-lg overflow-hidden">
                <div className="flex flex-col items-start h-full overflow-auto w-full border-2 bg-gray-200 p-4 flex-grow">
                  <div className="w-full relative flex-grow">
                    <button
                      className="flex items-center justify-between text-md font-bold bg-blue-500 text-gray-50 px-4 py-1 rounded-full w-24 hover:bg-blue-600 mb-1 disabled:bg-gray-400"
                      onClick={handleAddBtnClick}
                      disabled={isDisabled()}
                    >
                      <AiOutlinePlus className="text-2xl " />
                      And
                    </button>
                    {showAddMenu && (
                      <Menu
                        data={menuData}
                        handleClick={handleMenuOptionsClick}
                      />
                    )}
                  </div>
                  <Queries />
                  <div className="flex items-center justify-end w-full">
                    <button
                      className="bg-yellow-500 px-4 py-1 text-md font-bold text-gray-50 hover:bg-yellow-600 rounded-full mr-2"
                      onClick={() => {
                        dispatch(setFilters([]));
                        gridApi.setFilterModel(null);
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="bg-blue-500 px-4 py-1 text-md font-bold text-gray-50 hover:bg-blue-600 rounded-full mr-2 disabled:bg-gray-400"
                      disabled={isDisabled() || !!!filters.length}
                      onClick={() => {
                        gridApi.setFilterModel(getFilterModel());
                        setShowModal(false);
                        dispatch(setFilters([]));
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="flex-none w-full lg:w-80 text-gray-50 h-36 lg:h-full">
                  <ReactJson
                    src={getFilterModel()}
                    theme="ocean"
                    enableClipboard={false}
                    displayObjectSize={false}
                    displayDataTypes={false}
                    shouldCollapse={false}
                    style={{
                      padding: 10,
                      height: "100%",
                      overflowY: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-60 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default QueryBuilderModal;
