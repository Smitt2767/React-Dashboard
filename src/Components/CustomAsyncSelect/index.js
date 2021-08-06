import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import API from "../../services/api";

const CustomAsyncSelect = ({
  value,
  onChange,
  isMulti,
  limit,
  id,
  place_holder,
  labelName,
  onBlur,
}) => {
  const loadOptions = async (search, prevOptions, { page }) => {
    let options = [];
    let hasMore = false;
    if (search) {
      const res = await API.get(`/${id}`, {
        params: {
          page,
          limit,
          search,
        },
      });
      options = res.data.data.map(({ user_id, username }) => {
        return {
          label: username,
          value: user_id,
        };
      });
      const totalRecords = res.data.totalRecords;
      const currentRecords = page * limit;

      if (totalRecords > currentRecords) hasMore = true;
      else hasMore = false;
    } else {
      const res = await API.get(`/${id}`, {
        params: {
          page,
          limit,
          search,
        },
      });
      options = res.data.data.map(({ user_id, username }) => {
        return {
          label: username,
          value: user_id,
        };
      });
      const totalRecords = res.data.totalRecords;
      const currentRecords = page * limit;

      if (totalRecords > currentRecords) hasMore = true;
      else hasMore = false;
    }

    return {
      options,
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  return (
    <>
      <label className="mb-1 font-bold text-lg ml-3" htmlFor={id}>
        {labelName}
      </label>
      <AsyncPaginate
        id={id}
        defaultOptions
        value={value}
        onChange={onChange}
        loadOptions={loadOptions}
        isMulti={isMulti}
        closeMenuOnSelect={false}
        additional={{
          page: 1,
        }}
        placeholder={place_holder}
        className="mt-1"
        onBlur={onBlur}
      />
    </>
  );
};

export default CustomAsyncSelect;
