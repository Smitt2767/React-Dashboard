import React from "react";
import { useSelector } from "react-redux";
import GenerateGroupQueryBlock from "./GenerateGroupQueryBlock";
import GenerateQueryBlock from "./GenerateQueryBlock";

const Queries = () => {
  const { filters } = useSelector((state) => state.agGrid);
  return (
    <div className="h-full w-full mt-4 overflow-y-auto">
      {filters.map((column) => {
        return (
          <React.Fragment key={column.id}>
            {column.operator ? (
              <GenerateGroupQueryBlock column={column} />
            ) : (
              <GenerateQueryBlock column={column} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Queries;
