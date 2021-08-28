import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";

const initialState = {
  filters: [],
  columns: [],
  types: {
    number: [
      "equals",
      "notEqual",
      "lessThan",
      "lessThanOrEqual",
      "greaterThan",
      "graterThanOrEqual",
      "inRange",
    ],
    text: [
      "contains",
      "equals",
      "notContains",
      "notEqual",
      "startsWith",
      "endsWith",
    ],
    date: ["equals", "notEqual", "lessThan", "greaterThan", "inRange"],
  },
};

const agGridSlice = createSlice({
  name: "agGrid",
  initialState,
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    //
    addNewDefaultFilter: (state, action) => {
      if (action.payload === "Add Condition") {
        state.filters.push({
          id: uuidV4(),
          columnName: "athlete",
          filterType: "text",
          type: "contains",
          filter: "",
        });
      } else {
        state.filters.push({
          id: uuidV4(),
          columnName: "athlete",
          filterType: "text",
          operator: "OR",
          condition1: {
            filterType: "text",
            type: "contains",
            filter: "",
          },
          condition2: {
            filterType: "text",
            type: "contains",
            filter: "",
          },
        });
      }
    },
    //
    handleDelete: (state, action) => {
      state.filters = state.filters.filter(
        (column) => column.id !== action.payload
      );
    },
    handleColumnNameChnage: (state, action) => {
      const { id, value } = action.payload;

      state.filters.forEach((column) => {
        if (column.id === id) {
          if (!column.operator) {
            column.columnName = value;
            column.filterType = state.columns.find(
              (column) => column.name === value
            ).filterType;
            column.type = state.columns.find(
              (column) => column.name === value
            ).type;
            column.filter = "";
            delete column.filterTo;
          } else {
            column.columnName = value;
            column.filterType = state.columns.find(
              (column) => column.name === value
            ).filterType;
            column.condition1.filterType = state.columns.find(
              (column) => column.name === value
            ).filterType;
            column.condition2.filterType = state.columns.find(
              (column) => column.name === value
            ).filterType;
            column.condition1.type = state.columns.find(
              (column) => column.name === value
            ).type;
            column.condition2.type = state.columns.find(
              (column) => column.name === value
            ).type;
            column.condition1.filter = "";
            delete column.condition1.filterTo;
            column.condition2.filter = "";
            delete column.condition2.filterTo;
          }
        }
      });
    },
    //
    handleColumnTypeChange: (state, action) => {
      const { id, value, condition } = action.payload;
      state.filters.forEach((column) => {
        if (column.id === id) {
          if (!column.operator) {
            column.type = value;
            if (value === "inRange") {
              column.filterTo = "";
            } else {
              delete column.filterTo;
            }
          } else {
            column[condition].type = value;
            if (value === "inRange") {
              column[condition].filterTo = "";
            } else {
              delete column[condition].filterTo;
            }
          }
        }
      });
    },
    //
    handleColumnTextInputChnage: (state, action) => {
      const { id, value, condition } = action.payload;
      state.filters.forEach((column) => {
        if (column.id === id) {
          if (!column.operator) {
            column.filter = value;
          } else {
            column[condition].filter = value;
          }
        }
      });
    },
    //
    handleColumnNumberInputChange: (state, action) => {
      const { id, filter, filterTo, condition } = action.payload;
      state.filters.forEach((column) => {
        if (column.id === id) {
          if (!column.operator) {
            column.filter = !!filter ? filter * 1 : "";
            if (column.type === "inRange") {
              column.filterTo = !!filterTo ? filterTo * 1 : "";
            }
          } else {
            column[condition].filter = !!filter ? filter * 1 : "";
            if (column[condition].type === "inRange") {
              column[condition].filterTo = !!filterTo ? filterTo * 1 : "";
            }
          }
        }
      });
    },
    //
    handleColumnDateInputChnage: (state, action) => {
      const { id, filter, filterTo, condition } = action.payload;
      state.filters.forEach((column) => {
        if (column.id === id) {
          if (!column.operator) {
            column.filter = !!filter ? filter : "";
            if (column.type === "inRange") {
              column.filterTo = !!filterTo ? filterTo : "";
            }
          } else {
            column[condition].filter = !!filter ? filter : "";
            if (column[condition].type === "inRange") {
              column[condition].filterTo = !!filterTo ? filterTo : "";
            }
          }
        }
      });
    },
    //
    handleOperatorChange: (state, action) => {
      const { id, value } = action.payload;

      state.filters.forEach((column) => {
        if (column.id === id) {
          column.operator = value;
        }
      });
    },
    //
    setFilters: (state, action) => {
      state.filters = [...action.payload];
    },
    //
  },
});

export default agGridSlice.reducer;

export const {
  setColumns,
  addNewDefaultFilter,
  handleDelete,
  handleColumnNameChnage,
  handleColumnTypeChange,
  handleColumnTextInputChnage,
  handleColumnNumberInputChange,
  handleColumnDateInputChnage,
  handleOperatorChange,
  setFilters,
} = agGridSlice.actions;
