import React, { useMemo, useRef, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useColumnOrder,
} from "react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const THEAD = "THEAD";

const Table = ({ columns, data, hasMore, next }) => {
  const [tableHeight, setTableHeight] = useState(0);
  const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  const [tableFooterHeight, setTableFooterHeight] = useState(0);
  const outerDivRef = useRef(null);
  const tableHeaderRef = useRef(null);
  const tableFooterRef = useRef(null);

  useEffect(() => {
    if (
      outerDivRef.current &&
      tableHeaderRef.current &&
      tableHeaderRef.current
    ) {
      setTableHeight(outerDivRef.current.offsetHeight);
      setTableHeaderHeight(tableHeaderRef.current.offsetHeight);
      setTableFooterHeight(tableFooterRef.current.offsetHeight);
    }
  }, []);

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
      <div
        className={`th text-center text-xl p-2  text-gray-50  ${
          isDragging ? "bg-gray-600 opacity-70" : "bg-gray-700"
        } ${isOver ? "border-b-4 border-pink-400" : ""}`}
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
      </div>
    );
  };

  return (
    <div
      className="h-full w-96 min-w-full overflow-y-auto overflow-x-auto"
      ref={outerDivRef}
    >
      <DndProvider backend={HTML5Backend}>
        <div {...getTableProps()} className="table w-full">
          <div className="thead " ref={tableHeaderRef}>
            {headerGroups.map((headerGroup, i) => {
              return (
                <div
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
                </div>
              );
            })}
          </div>

          <div
            className="tbody bg-gray-200 overflow-y-auto scrollRightPanel"
            style={{
              height: tableHeight - tableHeaderHeight - tableFooterHeight,
            }}
            id="scrollTBody"
          >
            <InfiniteScroll
              dataLength={rows.length}
              next={next}
              hasMore={hasMore}
              scrollableTarget="scrollTBody"
            >
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <div key={row.id} {...row.getRowProps()} className="tr">
                    {row.cells.map((cell) => (
                      <div
                        key={cell.column.id}
                        className="td text-gray-700 p-2"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </div>
                    ))}
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
          <div className="tfoot" ref={tableFooterRef}>
            {footerGroups.map((group) => (
              <div {...group.getFooterGroupProps()} className="tr">
                <div
                  {...group.headers[columns.length - 1].getFooterProps()}
                  className="td text-center text-lg p-2 bg-gray-700 text-gray-400"
                >
                  {group.headers[columns.length - 1].render("Footer")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Table;
