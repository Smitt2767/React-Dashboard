import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getData,
  deleteData,
  setShowModal,
  setPage,
  clearTableRelatedData,
} from "./store/ckSlice";
import { BsPencil, BsTrash } from "react-icons/bs";
import Alert from "../../Components/Modal/Alert";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useColumnOrder,
} from "react-table";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const CKList = (props) => {
  const { ckTableData, showModal, page, limit, hasMore, totalRecords } =
    useSelector((state) => state.ck);
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const outerDiv = React.useRef(null);

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

  useEffect(() => {
    if (outerDiv && outerDiv.current)
      setTableHeight(outerDiv.current.offsetHeight);

    return () => {
      dispatch(clearTableRelatedData());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getData({ page, limit }));
  }, [dispatch, page, limit]);

  const next = () => {
    console.log("hiiii");
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

    const {
      getTableProps,
      headerGroups,
      rows,
      prepareRow,
      footerGroups,
      setColumnOrder,
      visibleColumns,
    } = useTable(
      { columns, data, defaultColumn },
      useResizeColumns,
      useFlexLayout,
      useColumnOrder
    );
    const getData = (cell) => {
      if (cell.column.id === "id") {
        return (
          <td
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center p-2"
            {...cell.getCellProps()}
          >
            {cell.render("Cell")}
          </td>
        );
      } else if (cell.column.id === "data") {
        return (
          <td
            key={cell.column.id}
            className="td text-gray-700 p-2"
            {...cell.getCellProps()}
          >
            {innerTable(cell.value)}
          </td>
        );
      } else if (cell.column.id === "actions") {
        return (
          <td
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center p-2"
            {...cell.getCellProps()}
          >
            {actionButtons(cell.row.values.id)}
          </td>
        );
      } else {
        return (
          <td
            key={cell.column.id}
            className="td text-gray-700 flex items-center justify-center"
            {...cell.getCellProps()}
          >
            Setup First
          </td>
        );
      }
    };
    const THEAD = "THEAD";

    const Header = ({ header }) => {
      const dropRef = React.useRef(null);
      const dragRef = React.useRef(null);

      const [{ isOver }, drop] = useDrop({
        accept: THEAD,
        drop: (item, monitor) => {
          const currentItems = [...visibleColumns.map(({ id }) => id)];

          const dragIndex = currentItems.indexOf(item.id);
          const dropIndex = currentItems.indexOf(header.id);

          let temp = currentItems[dragIndex];
          currentItems[dragIndex] = currentItems[dropIndex];
          currentItems[dropIndex] = temp;

          setColumnOrder(currentItems);
        },
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      });

      const [{ isDragging }, drag] = useDrag({
        item: { id: header.id },
        type: THEAD,
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      });

      drag(dragRef);
      drop(dragRef);

      return (
        <th
          className={`th text-center text-xl p-2  text-gray-50  ${
            isDragging ? "bg-gray-600 opacity-70" : "bg-gray-700"
          } ${isOver ? "border-b-4 border-pink-400" : ""} sticky top-0`}
          key={header.id}
          {...header.getHeaderProps()}
          ref={dropRef}
        >
          <div ref={dragRef}>{header.render("Header")}</div>
          {header.canResize && (
            <div
              {...header.getResizerProps()}
              className={`resizer ${header.isResizing ? "isResizing" : ""}`}
            />
          )}
        </th>
      );
    };

    return (
      <InfiniteScroll
        dataLength={rows.length}
        next={next}
        hasMore={hasMore}
        scrollableTarget="scroll"
      >
        <DndProvider backend={HTML5Backend}>
          <table {...getTableProps()} className="table w-full relative">
            <thead className="thead">
              {headerGroups.map((headerGroup, i) => {
                return (
                  <tr
                    key={i}
                    {...headerGroup.getHeaderGroupProps()}
                    className="tr"
                  >
                    {headerGroup.headers.map((header, i) => {
                      return (
                        <React.Fragment key={header.id}>
                          <Header header={header} index={i} />
                        </React.Fragment>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>

            <tbody className="tbody bg-gray-200">
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()} className="tr">
                    {row.cells.map((cell) => getData(cell))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="tfoot">
              {footerGroups.map((group) => (
                <tr {...group.getFooterGroupProps()} className="tr">
                  <td
                    {...group.headers[2].getFooterProps()}
                    className="td text-center text-lg p-2 bg-gray-700 text-gray-400"
                  >
                    {group.headers[2].render("Footer")}
                  </td>
                </tr>
              ))}
            </tfoot>
          </table>
        </DndProvider>
      </InfiniteScroll>
    );
  };

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
      <div className="w-full h-full overflow-hidden" ref={outerDiv}>
        <div
          className=" overflow-y-auto relative"
          style={{ height: tableHeight }}
          id="scroll"
        >
          <Table columns={columns} data={ckTableData} />
        </div>
      </div>
    </div>
  );
};

export default CKList;
