import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData, deleteData, setShowModal, setPage } from "./store/ckSlice";
import { BsPencil, BsTrash } from "react-icons/bs";
import Alert from "../../Components/Modal/Alert";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTable, useResizeColumns, useFlexLayout } from "react-table";

const CKList = (props) => {
  const { ckTableData, showModal, page, limit, hasMore, totalRecords } =
    useSelector((state) => state.ck);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);

  useEffect(() => {
    if (page === 1) {
      dispatch(getData({ page, limit }));
      dispatch(setPage(page + 1));
    }
  }, [dispatch, page, limit]);

  const next = () => {
    dispatch(getData({ page, limit }));
    dispatch(setPage(page + 1));
  };

  const innerTable = (data) => {
    return (
      <ul className="ck-content flex flex-col justify-center ">
        {data.map((ckData) => {
          return (
            <li
              key={ckData.id}
              dangerouslySetInnerHTML={{ __html: ckData.data }}
            ></li>
          );
        })}
      </ul>
    );
  };

  const handleButtonClick = (data) => {
    dispatch(setShowModal(data));
  };

  const handleYesBtnClicked = () => {
    if (id) {
      dispatch(deleteData({ id }));
    }
  };

  const actionButtons = (id) => {
    return (
      <>
        <button
          className="bg-blue-500 rounded-full p-2 lg:p-3 mr-4 hover:bg-blue-700 shadow-lg"
          onClick={() => {
            props.history.push(`/ckeditor/${id}`);
          }}
        >
          <BsPencil className="text-lg lg:text-2xl text-gray-50 " />
        </button>
        <button
          className="bg-red-500 rounded-full p-2 lg:p-3  hover:bg-red-700 shadow-lg"
          onClick={() => {
            setId(id);
            dispatch(setShowModal(true));
          }}
        >
          <BsTrash className="text-lg lg:text-2xl text-gray-50" />
        </button>
      </>
    );
  };

  const Table = ({ columns, data }) => {
    const defaultColumn = useMemo(
      () => ({
        minWidth: 10,
        width: 150,
        maxWidth: 1000,
      }),
      []
    );

    const { getTableProps, headerGroups, rows, prepareRow, footerGroups } =
      useTable(
        { columns, data, defaultColumn },
        useResizeColumns,
        useFlexLayout
      );

    const getData = (cell) => {
      if (cell.column.id === "id") {
        return (
          <div
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center p-2"
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </div>
        );
      } else if (cell.column.id === "data") {
        return (
          <div
            key={cell.column.id}
            className="td text-gray-700 p-2"
            {...cell.getCellProps()}
          >
            {innerTable(cell.value)}
          </div>
        );
      } else if (cell.column.id === "actions") {
        return (
          <div
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center p-2"
            {...cell.getCellProps()}
          >
            {actionButtons(cell.row.values.id)}
          </div>
        );
      } else {
        return (
          <div
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center"
            {...cell.getCellProps()}
          >
            Setup First
          </div>
        );
      }
    };

    return (
      <div
        {...getTableProps()}
        className="table w-full overflow-x-auto overflow-y-auto"
      >
        <div className="thead">
          {headerGroups.map((headerGroup, i) => {
            return (
              <div
                key={i}
                {...headerGroup.getHeaderGroupProps()}
                className="tr"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <div
                      className="th text-center text-xl p-2 bg-gray-700 text-gray-50"
                      key={header.id}
                      {...header.getHeaderProps()}
                    >
                      {header.render("Header")}
                      {header.canResize && (
                        <div
                          {...header.getResizerProps()}
                          className={`resizer ${
                            header.isResizing ? "isResizing" : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div
          className="tbody bg-gray-200 h-full overflow-y-auto overflow-x-auto"
          id="scrollableDiv"
        >
          <InfiniteScroll
            dataLength={rows.length}
            next={next}
            scrollableTarget="scrollableDiv"
            hasMore={hasMore}
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <div key={row.id} {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => getData(cell))}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
        <div className="tfoot">
          {footerGroups.map((group) => (
            <div {...group.getFooterGroupProps()} className="tr">
              {/* {group.headers.map((column) => (
                <div
                  {...column.getFooterProps()}
                  className="td text-center text-lg p-2 bg-gray-700 text-gray-400"
                >
                  {column.render("Footer")}
                </div>
              ))} */}
              <div
                {...group.headers[2].getFooterProps()}
                className="td text-center text-lg p-2 bg-gray-700 text-gray-400"
              >
                {group.headers[2].render("Footer")}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "id", width: 40 },
      {
        Header: "Data",
        accessor: "data",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Footer: `Total Records - ${totalRecords}`,
        width: 100,
      },
    ],
    [totalRecords]
  );

  return (
    <div className="w-full h-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-hidden">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        CKEditor List
      </h1>

      {showModal && id && (
        <Alert
          setShowModal={handleButtonClick}
          handleYesBtnClicked={handleYesBtnClicked}
        />
      )}

      <Table columns={columns} data={ckTableData} />
    </div>
  );
};

export default CKList;
